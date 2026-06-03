import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import BuyerDashboardView from './BuyerDashboardView';

export default async function BuyerDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'BUYER') {
    redirect('/login');
  }

  // Fetch or dynamically create the buyer profile
  let profile = await prisma.profile.findUnique({
    where: { userId: session.id },
  });

  if (!profile) {
    const userPrefix = session.email.split('@')[0];
    profile = await prisma.profile.create({
      data: {
        userId: session.id,
        name: '', // Left empty to prompt user to fill
        companyName: `${userPrefix.toUpperCase()} Ltd`,
        contactNumber: '',
        pincode: '',
        district: '',
        state: '',
        country: 'India',
        companyAddress: '',
        companyDescription: '',
        isCompleted: false,
      },
    });
  }

  // Fetch metrics for the Buyer's Business Overview
  const totalOrders = await prisma.order.findMany({
    where: { buyerId: session.id },
  });

  const activeOrdersCount = totalOrders.filter(
    (o) => o.status === 'APPROVED' || o.status === 'COMPLETED'
  ).length;

  const pendingEnquiriesCount = totalOrders.filter(
    (o) => o.status === 'PENDING'
  ).length;

  const totalSourcedValue = totalOrders
    .filter((o) => o.status === 'APPROVED' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + Number(o.totalPrice), 0);

  return (
    <BuyerDashboardView
      userEmail={session.email}
      isVerified={session.isVerified}
      initialProfile={profile}
      metrics={{
        activeOrders: activeOrdersCount,
        pendingEnquiries: pendingEnquiriesCount,
        totalSourced: totalSourcedValue,
      }}
    />
  );
}