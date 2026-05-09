import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
      downloads: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  try {
    const { items, total, paymentMethod, paymentRef, receiptImageUrl, wilaya, notes } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "لا توجد منتجات في الطلب" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        currency: "DZD",
        paymentMethod,
        paymentRef,
        receiptImageUrl,
        wilaya,
        notes,
        status: "pending",
        items: {
          create: items.map((item: { productId: string; price: number }) => ({
            productId: item.productId,
            price: item.price,
            currency: "DZD",
          })),
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ في إنشاء الطلب" }, { status: 500 });
  }
}
