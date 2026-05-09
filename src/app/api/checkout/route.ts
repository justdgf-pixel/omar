import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createChargilyCheckout } from "@/lib/chargily";

const Schema = z.object({
  locale: z.enum(["ar", "fr", "en"]),
  paymentMethod: z.enum([
    "CHARGILY_EDAHABIA",
    "CHARGILY_CIB",
    "BARIDIMOB",
    "BANK_TRANSFER"
  ]),
  items: z
    .array(z.object({ productId: z.string().min(1) }))
    .min(1)
    .max(50)
});

function orderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SD-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const products = await prisma.product.findMany({
    where: {
      id: { in: parsed.data.items.map((i) => i.productId) },
      status: "PUBLISHED"
    }
  });
  if (products.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  const total = products.reduce((s, p) => s + p.priceDzd, 0);

  const order = await prisma.order.create({
    data: {
      number: orderNumber(),
      userId: user.id,
      totalDzd: total,
      paymentMethod: parsed.data.paymentMethod,
      status: "PENDING",
      items: {
        create: products.map((p) => ({
          productId: p.id,
          unitDzd: p.priceDzd
        }))
      }
    }
  });

  const origin = new URL(req.url).origin;
  const locale = parsed.data.locale;

  if (
    parsed.data.paymentMethod === "BANK_TRANSFER" ||
    parsed.data.paymentMethod === "BARIDIMOB"
  ) {
    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: `${origin}/${locale}/checkout/success?orderId=${order.id}&pending=1`
    });
  }

  const checkout = await createChargilyCheckout({
    amountDzd: total,
    orderId: order.id,
    successUrl: `${origin}/${locale}/checkout/success?orderId=${order.id}`,
    failureUrl: `${origin}/${locale}/checkout/failure?orderId=${order.id}`,
    webhookUrl: `${origin}/api/payments/webhook`,
    customerEmail: user.email,
    customerName: user.name ?? undefined,
    paymentMethod:
      parsed.data.paymentMethod === "CHARGILY_CIB" ? "cib" : "edahabia",
    locale
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { chargilyId: checkout.checkoutId }
  });

  return NextResponse.json({
    orderId: order.id,
    checkoutUrl: checkout.checkoutUrl
  });
}
