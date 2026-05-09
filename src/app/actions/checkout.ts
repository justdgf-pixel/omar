"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { clearCart, readCart } from "@/lib/cart";
import { savePublicUpload } from "@/lib/uploads";
import { makeOrderNumber } from "@/lib/orderNumber";
import {
  PAYMENT_METHODS,
  type PaymentMethod,
  isManualMethod,
  isSatimConfigured,
} from "@/lib/payments";

const ALLOWED = PAYMENT_METHODS as readonly string[];

export async function placeOrderAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const items = await readCart();
  if (items.length === 0) redirect("/cart");

  const method = String(formData.get("method") || "");
  if (!ALLOWED.includes(method)) {
    redirect("/checkout?error=method");
  }
  if (method === "CIB_EDAHABIA" && !isSatimConfigured()) {
    redirect("/checkout?error=cib_not_configured");
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const lines = items
    .map((i) => ({ qty: i.qty, p: products.find((x) => x.id === i.productId) }))
    .filter((r) => r.p && r.p.status === "PUBLISHED");
  if (lines.length === 0) redirect("/cart");

  const total = lines.reduce((acc, r) => acc + r.p!.priceDzd * r.qty, 0);

  // Optional proof upload (mandatory for manual methods).
  let proofImage: string | null = null;
  const file = formData.get("proof");
  if (file && typeof file !== "string" && file.size > 0) {
    const r = await savePublicUpload(file, "proof");
    proofImage = r.url;
  }
  const ref = String(formData.get("ref") || "").slice(0, 80) || null;
  const note = String(formData.get("note") || "").slice(0, 500) || null;

  const seq = (await prisma.order.count()) + 1;
  const number = makeOrderNumber(seq);

  // Manual methods → AWAITING_REVIEW once a proof is provided, otherwise PENDING_PAYMENT.
  // CIB online → leave PENDING_PAYMENT (gateway flow).
  const status =
    isManualMethod(method as PaymentMethod) && proofImage
      ? "AWAITING_REVIEW"
      : "PENDING_PAYMENT";

  const order = await prisma.order.create({
    data: {
      number,
      buyerId: user.id,
      totalDzd: total,
      method,
      status,
      proofImage,
      proofRef: ref,
      buyerNote: note,
      items: {
        create: lines.map((r) => ({
          productId: r.p!.id,
          qty: r.qty,
          priceDzd: r.p!.priceDzd,
          titleSnapshot: r.p!.titleFr || r.p!.titleEn || r.p!.titleAr,
        })),
      },
    },
  });

  await clearCart();
  revalidatePath("/", "layout");

  if (method === "CIB_EDAHABIA") {
    // SATIM redirect would go here once configured.
    redirect(`/orders/${order.id}/pay`);
  }
  redirect(`/orders/${order.id}/thanks`);
}

const proofSchema = z.object({
  ref: z.string().max(80).optional(),
  note: z.string().max(500).optional(),
});

export async function submitProofAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const orderId = String(formData.get("orderId") || "");
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.buyerId !== user.id) redirect("/account");
  if (order.status !== "PENDING_PAYMENT") redirect(`/orders/${orderId}/thanks`);

  const parsed = proofSchema.safeParse({
    ref: formData.get("ref") || undefined,
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) redirect(`/orders/${orderId}/pay?error=invalid`);

  let proofImage = order.proofImage;
  const file = formData.get("proof");
  if (file && typeof file !== "string" && file.size > 0) {
    const r = await savePublicUpload(file, "proof");
    proofImage = r.url;
  }
  if (!proofImage) redirect(`/orders/${orderId}/pay?error=missing_proof`);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      proofImage,
      proofRef: parsed.data.ref ?? order.proofRef,
      buyerNote: parsed.data.note ?? order.buyerNote,
      status: "AWAITING_REVIEW",
    },
  });
  revalidatePath("/account");
  redirect(`/orders/${orderId}/thanks`);
}
