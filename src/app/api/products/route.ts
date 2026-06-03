import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { convertToBaseQty } from '@/lib/conversions';
import { Prisma } from '@/generated/client'; // Path alias points directly to src/generated/client

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const where: Prisma.ProductWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { casNumber: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      category ? { category } : {},
    ],
  };

  const products = await prisma.product.findMany({
    where,
    include: {
      seller: {
        select: {
          profile: true,
          isVerified: true,
        },
      },
    },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SELLER') {
    return NextResponse.json({ error: 'Unauthorized seller role' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const baseUnitMapping: Record<string, string> = {
      kg: 'g',
      g: 'g',
      L: 'mL',
      mL: 'mL',
      items: 'items',
    };

    const displayUnit = data.unit;
    const baseUnit = baseUnitMapping[displayUnit] || 'g';

    const multi = displayUnit === 'kg' || displayUnit === 'L' ? 1000 : 1;
    const pricePerBaseUnit = data.price / multi;

    const baseMinOrderQty = convertToBaseQty(data.minOrderQty, displayUnit);
    const baseAvailableQty = convertToBaseQty(data.availableQty, displayUnit);

    const product = await prisma.product.create({
      data: {
        sellerId: session.id,
        name: data.name,
        category: data.category,
        casNumber: data.casNumber,
        purity: new Prisma.Decimal(data.purity),
        minOrderQty: new Prisma.Decimal(baseMinOrderQty),
        availableQty: new Prisma.Decimal(baseAvailableQty),
        baseUnit: baseUnit,
        pricePerBaseUnit: new Prisma.Decimal(pricePerBaseUnit),
        description: data.description || '',
        certifications: data.certifications || [],
      },
    });

    return NextResponse.json({ message: 'Product listed successfully', product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error publishing product' }, { status: 500 });
  }
}