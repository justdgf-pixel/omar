import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sellerId = searchParams.get("sellerId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "newest";

    const where: Record<string, unknown> = { status: "active" };
    if (category) where.category = { slug: category };
    if (featured === "true") where.featured = true;
    if (sellerId) where.sellerId = sellerId;
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];

    const orderBy: Record<string, string> =
      sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" }
        : sort === "popular" ? { downloads: "desc" } : sort === "rating" ? { rating: "desc" } : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: where as any, include: { category: { select: { name: true, slug: true } }, seller: { select: { name: true, id: true } } },
        orderBy, take: limit, skip: (page - 1) * limit,
      }),
      prisma.product.count({ where: where as any }),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, comparePrice, categoryId, sellerId, fileUrl, fileSize, fileType, images, tags, featured } = body;

    if (!title || !description || !price || !categoryId || !sellerId || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { title, description, price, comparePrice, categoryId, sellerId, fileUrl, fileSize, fileType, images: JSON.stringify(images || []), tags: JSON.stringify(tags || []), featured: featured || false },
      include: { category: { select: { name: true, slug: true } }, seller: { select: { name: true, id: true } } },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
