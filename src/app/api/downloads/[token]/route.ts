import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyDownloadToken } from "@/lib/downloads";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const claim = verifyDownloadToken(params.token);
  if (!claim) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const item = await prisma.orderItem.findUnique({
    where: { id: claim.orderItemId },
    include: { order: true, product: true }
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buyer = await prisma.user.findUnique({ where: { id: item.order.userId } });
  if (!buyer || buyer.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (item.order.status !== "PAID") {
    return NextResponse.json({ error: "Order not paid" }, { status: 402 });
  }

  if (!item.product.fileKey) {
    return NextResponse.json(
      { error: "Product has no downloadable file" },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), "public", item.product.fileKey);
  let buf: Buffer;
  try {
    buf = await fs.readFile(filePath);
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const downloadName =
    item.product.fileName ?? path.basename(item.product.fileKey);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${downloadName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store"
    }
  });
}
