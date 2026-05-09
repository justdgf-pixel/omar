import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const MAX_BYTES = 10 * 1024 * 1024;

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "product"
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const titleAr = String(form.get("titleAr") ?? "").trim();
  const titleFr = String(form.get("titleFr") ?? "").trim() || titleAr;
  const titleEn = String(form.get("titleEn") ?? "").trim() || titleAr;
  const descriptionAr = String(form.get("descriptionAr") ?? "").trim();
  const descriptionFr = String(form.get("descriptionFr") ?? "").trim() || descriptionAr;
  const descriptionEn = String(form.get("descriptionEn") ?? "").trim() || descriptionAr;
  const priceDzd = Number(form.get("priceDzd"));
  const categoryIdRaw = String(form.get("categoryId") ?? "");
  const categoryId = categoryIdRaw || null;
  const coverImage = String(form.get("coverImage") ?? "").trim() || null;
  const file = form.get("file");

  if (!titleAr || !descriptionAr || !Number.isFinite(priceDzd) || priceDzd < 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let fileKey: string | null = null;
  let fileName: string | null = null;
  let fileSizeBytes: number | null = null;

  if (file && typeof file === "object" && "arrayBuffer" in file) {
    const f = file as File;
    if (f.size > 0) {
      if (f.size > MAX_BYTES) {
        return NextResponse.json({ error: "File too large" }, { status: 413 });
      }
      const dir = path.join(process.cwd(), "public", "uploads", "files");
      await fs.mkdir(dir, { recursive: true });
      const ext = path.extname(f.name) || "";
      const key = `${crypto.randomUUID()}${ext}`;
      await fs.writeFile(path.join(dir, key), Buffer.from(await f.arrayBuffer()));
      fileKey = `uploads/files/${key}`;
      fileName = f.name;
      fileSizeBytes = f.size;
    }
  }

  const baseSlug = slugify(titleEn || titleFr || titleAr);
  let slug = baseSlug;
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${baseSlug}-${crypto.randomBytes(2).toString("hex")}`;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: user.role === "ADMIN" ? "ADMIN" : "SELLER" }
  });

  const product = await prisma.product.create({
    data: {
      slug,
      titleAr,
      titleFr,
      titleEn,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      priceDzd: Math.round(priceDzd),
      coverImage,
      fileKey,
      fileName,
      fileSizeBytes,
      sellerId: user.id,
      categoryId,
      status: "PENDING_REVIEW"
    }
  });

  return NextResponse.json({ id: product.id, slug: product.slug });
}
