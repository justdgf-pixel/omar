import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إضافة منتج جديد</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
