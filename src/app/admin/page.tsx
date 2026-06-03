import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminVerificationsClient from './AdminVerificationsClient';

export default async function AdminVerificationsPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch all users and their profile details
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminVerificationsClient initialUsers={users} />;
}