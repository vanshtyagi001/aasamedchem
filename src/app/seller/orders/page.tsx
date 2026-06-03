import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import SellerOrdersClient from './SellerOrdersClient';

export default async function SellerOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== 'SELLER') {
    redirect('/login');
  }

  // Fetch all orders/quotations where this user is the seller
  const orders = await prisma.order.findMany({
    where: { sellerId: session.id },
    include: {
      buyer: {
        include: { profile: true },
      },
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize Decimal database structures into clean JS numbers
  const serializedOrders = orders.map((o) => ({
    id: o.id,
    buyerName: o.buyer.profile?.name || 'Unnamed Buyer',
    companyName: o.buyer.profile?.companyName || 'Corporate Entity',
    email: o.buyer.email,
    contactNumber: o.buyer.profile?.contactNumber || 'NA',
    productName: o.product.name,
    casNumber: o.product.casNumber,
    orderedQty: Number(o.orderedQty),
    orderedUnit: o.orderedUnit,
    totalPrice: Number(o.totalPrice),
    status: o.status,
    createdAt: o.createdAt.toLocaleDateString(),
  }));

  return <SellerOrdersClient initialOrders={serializedOrders} />;
}