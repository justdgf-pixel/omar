import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, thumbnail: true, fileUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, paymentMethod, paymentRef, paymentProof } = await req.json();

    if (!items || !items.length || !paymentMethod) {
      return NextResponse.json(
        { error: "Items and payment method are required" },
        { status: 400 }
      );
    }

    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const totalAmount = products.reduce((sum, p) => sum + p.price, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        paymentMethod,
        paymentRef: paymentRef || null,
        paymentProof: paymentProof || null,
        status: "pending",
        items: {
          create: products.map((p) => ({
            productId: p.id,
            price: p.price,
            downloadUrl: p.fileUrl,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, thumbnail: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
