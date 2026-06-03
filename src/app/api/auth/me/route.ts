import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Fetch the fresh verification status directly from the database
  const freshUser = await prisma.user.findUnique({
    where: { id: session.id },
    select: { isVerified: true },
  });

  return NextResponse.json({
    user: {
      ...session,
      isVerified: freshUser?.isVerified ?? false, // Override cookie status with real-time DB status
    },
  });
}