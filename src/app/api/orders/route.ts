import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newOrderReference } from "@/lib/orders";

const schema = z.object({
  productIds: z.array(z.string()).min(1),
  paymentMethod: z.enum(["CIB", "EDAHABIA", "BARIDIMOB", "CCP_TRANSFER"]),
  proofUrl: z.string().url().optional(),
  proofNote: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.productIds }, published: true },
  });
  if (products.length === 0) return NextResponse.json({ error: "No valid products" }, { status: 400 });

  const total = products.reduce((acc, p) => acc + p.priceCentimes, 0);

  const order = await prisma.order.create({
    data: {
      reference: newOrderReference(),
      paymentMethod: parsed.data.paymentMethod,
      totalCentimes: total,
      customerId: session.user.id,
      proofUrl: parsed.data.proofUrl,
      proofNote: parsed.data.proofNote,
      items: {
        create: products.map((p) => ({
          productId: p.id,
          titleSnapshot: p.titleEn,
          priceCentimes: p.priceCentimes,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ id: order.id, reference: order.reference, status: order.status });
}
