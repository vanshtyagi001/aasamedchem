import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { convertToBaseQty, calculateTotalPrice } from '@/lib/conversions';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let orders = [];
  if (session.role === 'ADMIN') {
    orders = await prisma.order.findMany({
      include: {
        buyer: { include: { profile: true } },
        seller: { include: { profile: true } },
        product: true,
      },
    });
  } else if (session.role === 'SELLER') {
    orders = await prisma.order.findMany({
      where: { sellerId: session.id },
      include: {
        buyer: { include: { profile: true } },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } else {
    orders = await prisma.order.findMany({
      where: { buyerId: session.id },
      include: {
        seller: { include: { profile: true } },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'BUYER') {
    return NextResponse.json({ error: 'Only buyers can request quotations' }, { status: 401 });
  }

  if (!session.isVerified) {
    return NextResponse.json(
      { error: 'Your corporate profile is not verified yet. Purchase permissions are locked.' },
      { status: 403 }
    );
  }

  try {
    const { productId, quantity, orderedUnit } = await req.json();

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const pricePerBaseUnit = Number(product.pricePerBaseUnit);
    const totalPrice = calculateTotalPrice(Number(quantity), orderedUnit, pricePerBaseUnit);
    const baseQty = convertToBaseQty(Number(quantity), orderedUnit);

    if (baseQty < Number(product.minOrderQty)) {
      return NextResponse.json({ error: 'Ordered quantity is lower than minimum order requirement.' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        buyerId: session.id,
        sellerId: product.sellerId,
        productId: product.id,
        quantity: baseQty,
        orderedUnit,
        orderedQty: quantity,
        totalPrice,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ message: 'Quotation sent successfully', order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit request' }, { status: 500 });
  }
}

// Add PATCH endpoint to allow Sellers/Admins to approve or reject quotes
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'SELLER' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized to update order' }, { status: 401 });
  }

  try {
    const { orderId, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order status' }, { status: 500 });
  }
}