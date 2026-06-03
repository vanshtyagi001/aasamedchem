import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // 1. Fetch all users
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
  });

  // 2. Fetch all globally listed products
  const products = await prisma.product.findMany({
    include: {
      seller: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 3. Fetch all orders across the marketplace
  const orders = await prisma.order.findMany({
    include: {
      buyer: { include: { profile: true } },
      seller: { include: { profile: true } },
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 4. Serialize products Decimal values for frontend stability
  const plainProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    casNumber: p.casNumber,
    purity: Number(p.purity),
    minOrderQty: Number(p.minOrderQty),
    availableQty: Number(p.availableQty),
    baseUnit: p.baseUnit,
    pricePerBaseUnit: Number(p.pricePerBaseUnit),
    description: p.description,
    certifications: p.certifications,
    sellerCompany: p.seller.profile?.companyName || 'Unknown Supplier',
  }));

  // 5. Serialize orders Decimal values
  const plainOrders = orders.map((o) => ({
    id: o.id,
    buyerName: o.buyer.profile?.name || 'Unnamed Buyer',
    buyerCompany: o.buyer.profile?.companyName || 'Corporate Entity',
    sellerCompany: o.seller.profile?.companyName || 'Supplier Entity',
    productName: o.product?.name || 'Deleted Product',
    casNumber: o.product?.casNumber || 'N/A',
    orderedQty: Number(o.orderedQty),
    orderedUnit: o.orderedUnit,
    totalPrice: Number(o.totalPrice),
    status: o.status,
    createdAt: o.createdAt.toLocaleDateString(),
  }));

  return (
    <AdminDashboard
      initialUsers={users}
      initialProducts={plainProducts}
      initialOrders={plainOrders}
    />
  );
}