import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { prisma } from "@/lib/db";
import { verifyDownloadToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  let payload;
  try {
    payload = await verifyDownloadToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const dl = await prisma.download.findUnique({
    where: { id: payload.did },
    include: { product: true, order: true },
  });
  if (!dl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (dl.userId !== payload.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (dl.order.status !== "PAID") {
    return NextResponse.json({ error: "Order not paid" }, { status: 402 });
  }
  if (dl.expiresAt < new Date()) {
    return NextResponse.json({ error: "Link expired" }, { status: 410 });
  }
  if (dl.count >= dl.maxCount) {
    return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
  }
  if (!dl.product.fileKey) {
    return NextResponse.json(
      { error: "Product file not yet uploaded by the seller" },
      { status: 503 },
    );
  }

  const filePath = dl.product.fileKey;
  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 500 });
  }

  await prisma.download.update({
    where: { id: dl.id },
    data: { count: { increment: 1 } },
  });

  const stream = createReadStream(filePath);
  const fileName = dl.product.fileName ?? path.basename(filePath);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
