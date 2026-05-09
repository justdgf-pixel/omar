import { cookies } from "next/headers";

const COOKIE = "sdz_cart";

export type CartItem = { productId: string; qty: number };

export async function readCart(): Promise<CartItem[]> {
  const c = await cookies();
  const raw = c.get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (x) =>
          x && typeof x.productId === "string" && Number.isFinite(Number(x.qty)),
      )
      .map((x) => ({ productId: x.productId, qty: Math.max(1, Number(x.qty)) }));
  } catch {
    return [];
  }
}

export async function writeCart(items: CartItem[]) {
  const c = await cookies();
  c.set(COOKIE, JSON.stringify(items), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
}

export async function addToCart(productId: string, qty = 1) {
  const items = await readCart();
  const idx = items.findIndex((x) => x.productId === productId);
  if (idx >= 0) items[idx].qty += qty;
  else items.push({ productId, qty });
  await writeCart(items);
}

export async function removeFromCart(productId: string) {
  const items = (await readCart()).filter((x) => x.productId !== productId);
  await writeCart(items);
}

export async function clearCart() {
  await writeCart([]);
}
