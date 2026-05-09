import { cookies } from 'next/headers';
import { prisma } from './db';

export interface CartItem {
  productId: string;
  quantity: number; // for digital products we keep at 1, but allow flexibility
}

const CART_COOKIE = 'souk_cart';

export function readCart(): CartItem[] {
  const raw = cookies().get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i.productId === 'string');
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  cookies().set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearCartCookie() {
  cookies().delete(CART_COOKIE);
}

export async function expandCart(items: CartItem[]) {
  if (items.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, published: true },
    include: { category: true },
  });
  return products.map((p) => ({
    product: p,
    quantity: items.find((i) => i.productId === p.id)?.quantity ?? 1,
  }));
}

export function cartTotalCents(rows: { product: { priceCents: number }; quantity: number }[]) {
  return rows.reduce((sum, r) => sum + r.product.priceCents * r.quantity, 0);
}
