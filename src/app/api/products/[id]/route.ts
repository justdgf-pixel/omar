import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.nameFr && { nameFr: data.nameFr }),
        ...(data.nameAr && { nameAr: data.nameAr }),
        ...(data.description && { description: data.description }),
        ...(data.descriptionFr && { descriptionFr: data.descriptionFr }),
        ...(data.descriptionAr && { descriptionAr: data.descriptionAr }),
        ...(data.price !== undefined && { price: parseFloat(data.price) }),
        ...(data.comparePrice !== undefined && { comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
        ...(data.fileSize !== undefined && { fileSize: data.fileSize }),
        ...(data.fileType !== undefined && { fileType: data.fileType }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
