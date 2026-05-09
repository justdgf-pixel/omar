import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
    },
  });

  // If order is marked as paid, create download links for each item
  if (status === "paid") {
    for (const item of order.items) {
      const existingDownload = await prisma.download.findFirst({
        where: { orderId: id, productId: item.productId },
      });

      if (!existingDownload) {
        await prisma.download.create({
          data: {
            userId: order.userId,
            productId: item.productId,
            orderId: order.id,
            maxDownloads: 5,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          },
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: { totalSales: { increment: 1 } },
        });
      }
    }
  }

  return NextResponse.json(order);
}
