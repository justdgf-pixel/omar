import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const products = await prisma.product.findMany({
    include: { category: true, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  try {
    const data = await req.json();
    const slug = data.slug || slugify(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        slug,
        description: data.description,
        descriptionAr: data.descriptionAr,
        price: parseFloat(data.price),
        currency: data.currency ?? "DZD",
        imageUrl: data.imageUrl,
        previewUrl: data.previewUrl,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
        featured: data.featured ?? false,
        published: data.published ?? false,
        categoryId: data.categoryId,
        tags: data.tags,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
