import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSessionCookie({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    return NextResponse.json({
      message: 'Logged in successfully',
      user: { id: user.id, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Login failure' }, { status: 500 });
  }
}