import React from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getProducts(search?: string, category?: string, sort?: string) {
  const where: Record<string, unknown> = { published: true };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { nameAr: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }

  const orderBy: Record<string, string> =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "popular"
      ? { totalSales: "desc" }
      : sort === "rating"
      ? { rating: "desc" }
      : { createdAt: "desc" };

  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
    take: 48,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر مبيعاً" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params.search, params.category, params.sort),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">المنتجات الرقمية</h1>
        <p className="text-gray-500 text-sm">
          {products.length} منتج متاح {params.search ? `لـ "${params.search}"` : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
              <SlidersHorizontal className="h-4 w-4" /> الفئات
            </h2>
            <div className="space-y-1">
              <Link
                href="/products"
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  !params.category
                    ? "bg-emerald-100 text-emerald-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <span>جميع الفئات</span>
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}${params.search ? `&search=${params.search}` : ""}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    params.category === cat.slug
                      ? "bg-emerald-100 text-emerald-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span>{cat.nameAr ?? cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <form className="flex-1 relative" action="/products" method="GET">
              {params.category && (
                <input type="hidden" name="category" value={params.category} />
              )}
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="search"
                type="text"
                defaultValue={params.search}
                placeholder="ابحث عن منتج..."
                className="w-full h-10 pr-9 pl-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </form>
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/products?sort=${opt.value}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}`}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap",
                    params.sort === opt.value || (!params.sort && opt.value === "newest")
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-emerald-300"
                  )}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
