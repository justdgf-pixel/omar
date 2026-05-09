import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "admin") return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.nameAr !== undefined && { nameAr: data.nameAr }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.descriptionAr !== undefined && { descriptionAr: data.descriptionAr }),
      ...(data.price !== undefined && { price: parseFloat(data.price) }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
      ...(data.published !== undefined && { published: data.published }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
