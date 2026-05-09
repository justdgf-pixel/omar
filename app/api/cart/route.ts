import { NextResponse } from 'next/server';
import { z } from 'zod';
import { readCart, writeCart } from '@/lib/cart';
import { prisma } from '@/lib/db';

const addSchema = z.object({ productId: z.string(), quantity: z.number().int().positive().max(20).default(1) });
const removeSchema = z.object({ productId: z.string() });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product || !product.published) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const cart = readCart();
  const existing = cart.find((i) => i.productId === parsed.data.productId);
  if (existing) existing.quantity = 1; // digital products: one license per cart
  else cart.push({ productId: parsed.data.productId, quantity: 1 });
  writeCart(cart);
  return NextResponse.json({ ok: true, count: cart.length });
}

export async function DELETE(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = removeSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const cart = readCart().filter((i) => i.productId !== parsed.data.productId);
  writeCart(cart);
  return NextResponse.json({ ok: true, count: cart.length });
}
