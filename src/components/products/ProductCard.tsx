"use client";

import Link from "next/link";
import { ShoppingCart, Star, Download, BadgeCheck } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useLocaleStore } from "@/store/locale";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore();
  const { locale, t, isRTL } = useLocaleStore();

  const isInCart = items.some((i) => i.product.id === product.id);
  const name = locale === "ar" ? product.nameAr : product.name;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? calculateDiscount(product.price, product.originalPrice!)
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 overflow-hidden flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Link href={`/products/${product.id}`} className="relative block">
        <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
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
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          {product.bestseller && (
            <span
              className={cn(
                "absolute top-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg",
                hasDiscount ? "right-3" : "left-3"
              )}
            >
              {locale === "ar" ? "الأكثر مبيعًا" : "Bestseller"}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {product.fileType}
          </span>
          <span className="text-xs text-gray-400">{product.fileSize}</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 leading-snug">
            {name}
          </h3>
        </Link>

        <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            ({product.reviewCount} {t.products.reviews})
          </span>
          <span className="text-gray-200">|</span>
          <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
            <Download size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              {product.downloadCount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className={cn("flex items-center gap-1.5 mb-3", isRTL && "flex-row-reverse")}>
          {product.seller.verified && (
            <BadgeCheck size={14} className="text-blue-500" />
          )}
          <span className="text-xs text-gray-500">{product.seller.name}</span>
        </div>

        <div className="mt-auto">
          <div
            className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse"
            )}
          >
            <div className={cn("flex items-baseline gap-2", isRTL && "flex-row-reverse")}>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price, locale)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice!, locale)}
                </span>
              )}
            </div>
            <button
              onClick={() => addItem(product)}
              disabled={isInCart}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                isInCart
                  ? "bg-emerald-100 text-emerald-600 cursor-default"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:scale-95"
              )}
              title={isInCart ? "Dans le panier" : t.products.addToCart}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
