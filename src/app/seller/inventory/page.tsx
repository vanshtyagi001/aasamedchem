import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import SellerInventoryClient from './SellerInventoryClient';

export default async function SellerInventoryPage() {
  const session = await getSession();
  if (!session || session.role !== 'SELLER') {
    redirect('/login');
  }

  // Fetch all listed products for this specific seller
  const products = await prisma.product.findMany({
    where: { sellerId: session.id },
    orderBy: { createdAt: 'desc' },
  });

  // Convert Decimal types to floats for rendering stability
  const serializedProducts = products.map((p) => ({
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
  }));

  return <SellerInventoryClient initialProducts={serializedProducts} />;
}