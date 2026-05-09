import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    const download = await prisma.download.findUnique({
      where: { token },
      include: {
        order: {
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!download) {
      return NextResponse.json({ error: "Invalid download link" }, { status: 404 });
    }

    if (new Date() > download.expiresAt) {
      return NextResponse.json({ error: "Download link expired" }, { status: 410 });
    }

    if (download.downloadCount >= download.maxDownloads) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
    }

    await prisma.download.update({
      where: { id: download.id },
      data: { downloadCount: { increment: 1 } },
    });

    const product = download.order.items[0]?.product;
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Download started",
      product: {
        name: product.name,
        fileUrl: product.fileUrl,
        fileType: product.fileType,
        fileSize: product.fileSize,
      },
      remainingDownloads: download.maxDownloads - download.downloadCount - 1,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
