import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        isVerified: false, // Must be verified by Admin
      },
    });

    return NextResponse.json({
      message: 'Account registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failure' }, { status: 500 });
  }
}