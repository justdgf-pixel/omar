import { randomBytes } from "node:crypto";
import { prisma } from "./db";
import { signDownloadToken } from "./auth";

/**
 * When an order transitions to PAID, create one Download row per item
 * with a signed JWT token used by /api/download/[token].
 *
 * Tokens expire in 30 days; max 10 downloads each.
 */
export async function fulfillOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("order not found");
  if (order.status !== "PAID") throw new Error("order not paid");

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  for (const it of order.items) {
    // One Download row per product (regardless of qty for digital goods).
    const existing = await prisma.download.findFirst({
      where: { orderId: order.id, productId: it.productId },
    });
    if (existing) continue;
    const placeholderToken = randomBytes(16).toString("hex");
    const dl = await prisma.download.create({
      data: {
        orderId: order.id,
        productId: it.productId,
        userId: order.buyerId,
        token: placeholderToken,
        expiresAt,
      },
    });
    const token = await signDownloadToken({
      downloadId: dl.id,
      productId: it.productId,
      uid: order.buyerId,
      ttlSeconds: 60 * 60 * 24 * 30,
    });
    await prisma.download.update({
      where: { id: dl.id },
      data: { token },
    });
  }
}
