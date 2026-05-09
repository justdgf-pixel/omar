import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = { published: true };
    if (category) where.category = { slug: category };
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameFr: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const slug = slugify(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameFr: data.nameFr || data.name,
        nameAr: data.nameAr || data.name,
        slug,
        description: data.description,
        descriptionFr: data.descriptionFr || data.description,
        descriptionAr: data.descriptionAr || data.description,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        image: data.image || null,
        images: data.images ? JSON.stringify(data.images) : null,
        categoryId: data.categoryId,
        fileUrl: data.fileUrl || "",
        fileSize: data.fileSize || null,
        fileType: data.fileType || null,
        downloadLimit: data.downloadLimit || 5,
        featured: data.featured || false,
        published: data.published !== false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
