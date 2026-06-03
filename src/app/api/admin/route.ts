import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized route access' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: { profile: true },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const { targetUserId, verifyStatus } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isVerified: verifyStatus },
    });

    return NextResponse.json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}