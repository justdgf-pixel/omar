import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { stat } from "node:fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyDownload } from "@/lib/download-token";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./public/uploads";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const payload = verifyDownload(token);
  if (!payload) return new NextResponse("Invalid token", { status: 400 });

  const row = await prisma.downloadToken.findUnique({
    where: { token },
    include: { order: true },
  });
  if (!row) return new NextResponse("Token not found", { status: 404 });
  if (row.order.customerId !== session.user.id && session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (row.expiresAt < new Date()) return new NextResponse("Expired", { status: 410 });
  if (row.remainingUses <= 0) return new NextResponse("No uses left", { status: 410 });
  if (row.order.status !== "PAID") return new NextResponse("Order not paid", { status: 402 });

  const product = await prisma.product.findUniqueOrThrow({ where: { id: row.productId } });
  const filePath = path.resolve(UPLOAD_DIR, product.fileKey);
  // Ensure the resolved path is still inside UPLOAD_DIR (defence in depth).
  if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
    return new NextResponse("Bad path", { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File missing on server", { status: 404 });
  }

  await prisma.downloadToken.update({
    where: { id: row.id },
    data: { remainingUses: { decrement: 1 } },
  });

  const fileStat = await stat(filePath);
  const stream = fs.createReadStream(filePath) as unknown as ReadableStream;

  return new Response(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": product.fileMime || "application/octet-stream",
      "Content-Length": String(fileStat.size),
      "Content-Disposition": `attachment; filename="${encodeURIComponent(product.fileName)}"`,
      "Cache-Control": "no-store",
    },
  });
}
