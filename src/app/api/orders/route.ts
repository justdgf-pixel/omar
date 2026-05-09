import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get("buyerId");
    const sellerId = searchParams.get("sellerId");

    if (!buyerId && !sellerId) return NextResponse.json({ error: "buyerId or sellerId is required" }, { status: 400 });

    let where: Record<string, unknown> = {};
    if (buyerId) where = { buyerId };
    if (sellerId) where = { items: { some: { product: { sellerId } } } };

    const orders = await prisma.order.findMany({
      where: where as any,
      include: {
        items: { include: { product: { select: { id: true, title: true, images: true, fileUrl: true, seller: { select: { name: true, id: true } } } } } },
        buyer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId, items, paymentMethod, paymentRef, totalAmount } = body;

    if (!buyerId || !items || !items.length || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        buyerId, totalAmount, paymentMethod, paymentRef, status: "pending",
        items: { create: items.map((item: { productId: string; price: number }) => ({ productId: item.productId, price: item.price })) },
      },
      include: { items: { include: { product: { select: { title: true, images: true } } } } },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
