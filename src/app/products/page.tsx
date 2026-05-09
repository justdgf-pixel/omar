"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { useLocaleStore } from "@/store/locale";
import { products } from "@/data/products";
import { CATEGORIES, ProductCategory } from "@/types";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "priceAsc" | "priceDesc" | "popular" | "rating";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as ProductCategory | null;
  const searchQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">(
    initialCategory || "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { locale, t, isRTL } = useLocaleStore();

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameAr.includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t.products.title}
        </h1>
        {searchQuery && (
          <p className="text-gray-500">
            {locale === "ar"
              ? `نتائج البحث عن "${searchQuery}"`
              : `Résultats pour "${searchQuery}"`}
          </p>
        )}
      </div>

      <div className={cn(
        "flex flex-col sm:flex-row gap-4 mb-8",
        isRTL && "sm:flex-row-reverse"
      )}>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
              )}
            >
              {t.products.allCategories}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                )}
              >
                <span>{cat.icon}</span>
                {locale === "ar" ? cat.nameAr : cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className={cn(
              "appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 cursor-pointer hover:border-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
              isRTL ? "pl-8 pr-4" : "pr-8 pl-4"
            )}
          >
            <option value="newest">{t.products.sortOptions.newest}</option>
            <option value="priceAsc">{t.products.sortOptions.priceAsc}</option>
            <option value="priceDesc">{t.products.sortOptions.priceDesc}</option>
            <option value="popular">{t.products.sortOptions.popular}</option>
            <option value="rating">{t.products.sortOptions.rating}</option>
          </select>
          <ChevronDown
            size={16}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
              isRTL ? "left-2.5" : "right-2.5"
            )}
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {filteredProducts.length}{" "}
          {locale === "ar" ? "منتج" : "produit(s)"}
        </p>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 bg-gray-100 rounded-lg w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
