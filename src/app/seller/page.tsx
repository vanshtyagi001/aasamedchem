import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import SellerDashboardView from './SellerDashboardView';

export default async function SellerDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'SELLER') {
    redirect('/login');
  }

  // Fetch the corporate profile for this specific user ID
  let profile = await prisma.profile.findUnique({
    where: { userId: session.id },
  });

  // Automatically initialize a blank dynamic skeleton if it doesn't exist
  if (!profile) {
    const userPrefix = session.email.split('@')[0];
    profile = await prisma.profile.create({
      data: {
        userId: session.id,
        name: '', // Empty: forces user to fill
        companyName: `${userPrefix.toUpperCase()} Enterprise`, // Soft default
        contactNumber: '',
        pincode: '',
        district: '',
        state: '',
        country: 'India',
        companyAddress: '',
        companyDescription: '',
        category: 'MANUFACTURER',
        isCompleted: false,
      },
    });
  }

  // Fetch live metrics for Business Overview
  const totalItemsCount = await prisma.product.count({
    where: { sellerId: session.id },
  });

  const orders = await prisma.order.findMany({
    where: { sellerId: session.id },
  });

  const totalOrdersCount = orders.length;
  const totalRevenueSum = orders
    .filter((o) => o.status === 'APPROVED' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + Number(o.totalPrice), 0);

  return (
    <SellerDashboardView
      userEmail={session.email}
      isVerified={session.isVerified}
      initialProfile={profile}
      metrics={{
        totalItems: totalItemsCount,
        totalOrders: totalOrdersCount,
        totalRevenue: totalRevenueSum,
      }}
    />
  );
}