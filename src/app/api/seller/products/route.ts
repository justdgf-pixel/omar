import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./public/uploads";

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      // strip diacritics so French / Arabic translit slugs are clean
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || crypto.randomBytes(4).toString("hex")
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== "SELLER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const titleAr = String(form.get("titleAr") ?? "");
  const titleFr = String(form.get("titleFr") ?? "");
  const titleEn = String(form.get("titleEn") ?? "");
  const descAr = String(form.get("descAr") ?? "");
  const descFr = String(form.get("descFr") ?? "");
  const descEn = String(form.get("descEn") ?? "");
  const priceDzd = Number(form.get("priceDzd") ?? 0);
  const categoryId = String(form.get("categoryId") ?? "");
  const publish = form.get("publish") === "true";
  const file = form.get("file");

  if (!titleEn && !titleFr && !titleAr) {
    return NextResponse.json({ error: "Title required in at least one language" }, { status: 400 });
  }
  if (!categoryId || !priceDzd || priceDzd <= 0) {
    return NextResponse.json({ error: "Category and price are required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Digital file is required" }, { status: 400 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const id = crypto.randomBytes(8).toString("hex");
  const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, "_");
  const fileKey = `${id}_${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, fileKey), buf);

  const slugBase = slugify(titleEn || titleFr || titleAr);
  const slug = `${slugBase}-${id.slice(0, 5)}`;

  const product = await prisma.product.create({
    data: {
      slug,
      titleAr: titleAr || titleFr || titleEn,
      titleFr: titleFr || titleEn || titleAr,
      titleEn: titleEn || titleFr || titleAr,
      descAr: descAr || descFr || descEn,
      descFr: descFr || descEn || descAr,
      descEn: descEn || descFr || descAr,
      priceCentimes: Math.round(priceDzd * 100),
      categoryId,
      sellerId: session.user.id,
      published: publish,
      fileKey,
      fileName: file.name,
      fileSize: buf.length,
      fileMime: file.type || "application/octet-stream",
    },
  });

  return NextResponse.json({ id: product.id, slug: product.slug });
}
