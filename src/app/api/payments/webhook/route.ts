import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyChargilySignature } from "@/lib/chargily";

// Chargily Pay v2 webhook receiver.
// Expected event types: checkout.paid, checkout.failed, checkout.canceled
export async function POST(req: Request) {
  const raw = await req.text();
  const sig =
    req.headers.get("signature") ?? req.headers.get("chargily-signature");
  if (!verifyChargilySignature(raw, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { type?: string; data?: { id?: string; metadata?: Array<{ key: string; value: string }> } };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type ?? "";
  const meta = body.data?.metadata ?? [];
  const orderId = meta.find((m) => m.key === "order_id")?.value;
  const checkoutId = body.data?.id;

  if (!orderId && !checkoutId) {
    return NextResponse.json({ ok: true });
  }

  const order =
    (orderId
      ? await prisma.order.findUnique({ where: { id: orderId } })
      : null) ??
    (checkoutId
      ? await prisma.order.findFirst({ where: { chargilyId: checkoutId } })
      : null);
  if (!order) return NextResponse.json({ ok: true });

  if (type === "checkout.paid") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date() }
    });
  } else if (type === "checkout.failed" || type === "checkout.canceled") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" }
    });
  }

  return NextResponse.json({ ok: true });
}
