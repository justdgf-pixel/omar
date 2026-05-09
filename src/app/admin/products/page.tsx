"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Download,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { products as allProducts } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const { locale, t, isRTL } = useLocaleStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allProducts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.nameAr.includes(q) ||
      p.category.includes(q)
    );
  });

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <Link
            href="/admin"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.admin.products}
            </h1>
            <p className="text-gray-500 text-sm">
              {filtered.length} {locale === "ar" ? "منتج" : "produit(s)"}
            </p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all text-sm flex items-center gap-2">
          <Plus size={16} />
          {t.admin.addProduct}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search
              size={18}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-gray-400",
                isRTL ? "right-3" : "left-3"
              )}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.search}
              className={cn(
                "w-full py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm",
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              )}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "المنتج" : "Produit"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "الفئة" : "Catégorie"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "السعر" : "Prix"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "التقييم" : "Note"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "التحميلات" : "Téléch."}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "إجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const name =
                  locale === "ar" ? product.nameAr : product.name;
                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">
                            {product.category === "ebooks"
                              ? "📚"
                              : product.category === "courses"
                              ? "🎓"
                              : product.category === "templates"
                              ? "📄"
                              : product.category === "software"
                              ? "💻"
                              : product.category === "graphics"
                              ? "🎨"
                              : product.category === "music"
                              ? "🎵"
                              : "📷"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                            {name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.fileType} &middot; {product.fileSize}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.price, locale)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                        <Star
                          size={14}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={cn("flex items-center gap-1 text-gray-500", isRTL && "flex-row-reverse")}>
                        <Download size={14} />
                        <span className="text-sm">
                          {product.downloadCount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 size={15} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
