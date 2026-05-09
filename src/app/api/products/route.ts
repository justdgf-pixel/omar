import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = { slug: category };
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { nameAr: { contains: search } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(products);
}
