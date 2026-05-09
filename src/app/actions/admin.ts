"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fulfillOrder } from "@/lib/orderFulfill";

async function ensureAdmin() {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") redirect("/signin");
  return u;
}

export async function approveOrderAction(formData: FormData) {
  await ensureAdmin();
  const orderId = String(formData.get("orderId") || "");
  const note = String(formData.get("note") || "").slice(0, 500) || null;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID", paidAt: new Date(), adminNote: note },
  });
  await fulfillOrder(orderId);
  revalidatePath("/admin");
  revalidatePath(`/orders/${orderId}/thanks`);
  revalidatePath("/account");
}

export async function rejectOrderAction(formData: FormData) {
  await ensureAdmin();
  const orderId = String(formData.get("orderId") || "");
  const note = String(formData.get("note") || "").slice(0, 500) || null;
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REJECTED", rejectedAt: new Date(), adminNote: note },
  });
  revalidatePath("/admin");
  revalidatePath("/account");
}
