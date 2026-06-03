import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminCatalogClient from './AdminCatalogClient';

export default async function AdminCatalogPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch all listed products with seller names
  const products = await prisma.product.findMany({
    include: {
      seller: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

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
    sellerCompany: p.seller.profile?.companyName || 'Unknown Supplier',
  }));

  return <AdminCatalogClient initialProducts={serializedProducts} />;
}