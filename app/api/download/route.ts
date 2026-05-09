import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getCurrentUser, verifyDownloadToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });

  let payload: { orderItemId: string; userId: string };
  try {
    payload = await verifyDownloadToken(token);
  } catch {
    return NextResponse.json({ error: 'invalid or expired token' }, { status: 401 });
  }

  const user = await getCurrentUser();
  if (!user || user.id !== payload.userId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: payload.orderItemId },
    include: { order: true, product: true },
  });
  if (!orderItem || orderItem.order.buyerId !== user.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  if (orderItem.order.status !== 'PAID') {
    return NextResponse.json({ error: 'order not paid' }, { status: 402 });
  }

  const safeName = path.basename(orderItem.product.fileUrl);
  const filePath = path.join(process.cwd(), 'private-files', safeName);
  let buf: Buffer;
  try {
    buf = await fs.readFile(filePath);
  } catch {
    return NextResponse.json({ error: 'file missing' }, { status: 410 });
  }

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${orderItem.product.fileName}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
