"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addToCart, removeFromCart, writeCart, readCart } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  if (!productId) return;
  await addToCart(productId, 1);
  revalidatePath("/", "layout");
  redirect("/cart");
}

export async function buyNowAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  if (!productId) return;
  await addToCart(productId, 1);
  revalidatePath("/", "layout");
  redirect("/checkout");
}

export async function removeFromCartAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  if (!productId) return;
  await removeFromCart(productId);
  revalidatePath("/", "layout");
}

export async function updateQtyAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  const qty = Math.max(1, Math.min(99, Number(formData.get("qty") || 1)));
  if (!productId) return;
  const cart = await readCart();
  const idx = cart.findIndex((x) => x.productId === productId);
  if (idx >= 0) {
    cart[idx].qty = qty;
    await writeCart(cart);
  }
  revalidatePath("/", "layout");
}
