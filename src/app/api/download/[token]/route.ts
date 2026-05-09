import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { token } = await params;

  const download = await prisma.download.findUnique({
    where: { token },
    include: { product: true, order: true },
  });

  if (!download) {
    return NextResponse.json({ error: "رابط التحميل غير صالح" }, { status: 404 });
  }

  if (download.userId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  if (download.order.status !== "paid") {
    return NextResponse.json({ error: "الطلب لم يتم تأكيده بعد" }, { status: 402 });
  }

  if (download.maxDownloads > 0 && download.downloadCount >= download.maxDownloads) {
    return NextResponse.json({ error: "تم تجاوز الحد الأقصى للتحميلات" }, { status: 429 });
  }

  if (download.expiresAt && download.expiresAt < new Date()) {
    return NextResponse.json({ error: "انتهت صلاحية رابط التحميل" }, { status: 410 });
  }

  await prisma.download.update({
    where: { token },
    data: { downloadCount: { increment: 1 } },
  });

  if (!download.product.fileUrl) {
    return NextResponse.json({ error: "ملف المنتج غير متوفر" }, { status: 404 });
  }

  return NextResponse.redirect(download.product.fileUrl);
}
