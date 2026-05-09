import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultLocale, isLocale } from "@/lib/i18n";

// Mock payment confirmation used only when no Chargily key is configured.
// POST /api/payments/mock?orderId=...&result=paid|failed&locale=ar|fr|en
export async function POST(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  const result = url.searchParams.get("result");
  const localeParam = url.searchParams.get("locale");
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (result === "paid") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date() }
    });
    return NextResponse.redirect(
      `${url.origin}/${locale}/checkout/success?orderId=${order.id}`
    );
  }
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "FAILED" }
  });
  return NextResponse.redirect(
    `${url.origin}/${locale}/checkout/failure?orderId=${order.id}`
  );
}
