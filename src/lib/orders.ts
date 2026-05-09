import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { newJti, signDownload } from "@/lib/download-token";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // unambiguous

/** Short, human-friendly reference like SQM-7HK4-29F2. */
export function newOrderReference(): string {
  const part = (n: number) =>
    Array.from(crypto.randomFillSync(new Uint8Array(n)))
      .map((b) => ALPHABET[b % ALPHABET.length])
      .join("");
  return `SQM-${part(4)}-${part(4)}`;
}

/**
 * Mark an order as paid: flip status, stamp paidAt, and create one DownloadToken
 * per item. Idempotent — safe to call again from a webhook retry.
 */
export async function markOrderPaid(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, downloads: true },
  });
  if (!order) throw new Error("Order not found");
  if (order.status === "PAID") return order;

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date() },
    });
    if (order.downloads.length === 0) {
      for (const item of order.items) {
        const jti = newJti();
        const token = signDownload({ orderId: order.id, productId: item.productId, jti });
        await tx.downloadToken.create({
          data: {
            token,
            orderId: order.id,
            productId: item.productId,
            expiresAt,
            remainingUses: 5,
          },
        });
      }
    }
  });

  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { items: true, downloads: true },
  });
}
