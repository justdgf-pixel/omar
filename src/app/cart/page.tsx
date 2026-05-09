"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLocaleStore } from "@/store/locale";
import { formatPrice, cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, clearCart, getTotal } = useCartStore();
  const { locale, t, isRTL } = useLocaleStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-20 text-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.cart.empty}
        </h1>
        <p className="text-gray-500 mb-8">{t.cart.emptyDesc}</p>
        <Link
          href="/products"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all",
            isRTL && "flex-row-reverse"
          )}
        >
          {t.cart.continueShopping}
          {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.cart.title}</h1>
      <p className="text-gray-500 mb-8">
        {items.length} {t.cart.itemCount}
      </p>

      <div className="space-y-4 mb-8">
        {items.map((item) => {
          const name =
            locale === "ar" ? item.product.nameAr : item.product.name;
          return (
            <div
              key={item.product.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-emerald-100 transition-colors"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl opacity-50">
                  {item.product.category === "ebooks"
                    ? "📚"
                    : item.product.category === "courses"
                    ? "🎓"
                    : item.product.category === "templates"
                    ? "📄"
                    : item.product.category === "software"
                    ? "💻"
                    : item.product.category === "graphics"
                    ? "🎨"
                    : item.product.category === "music"
                    ? "🎵"
                    : "📷"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2"
                >
                  {name}
                </Link>
                <p className="text-sm text-gray-400 mt-1">
                  {item.product.fileType} &middot; {item.product.fileSize}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">
                  {formatPrice(item.product.price, locale)}
                </p>
                {item.product.originalPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    {formatPrice(item.product.originalPrice, locale)}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeItem(item.product.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                title={t.cart.remove}
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className={cn("flex items-center justify-between mb-4", isRTL && "flex-row-reverse")}>
          <span className="text-gray-500">{t.cart.subtotal}</span>
          <span className="font-semibold text-gray-900">
            {formatPrice(total, locale)}
          </span>
        </div>
        <div className={cn(
          "flex items-center justify-between mb-6 pb-4 border-b border-gray-100",
          isRTL && "flex-row-reverse"
        )}>
          <span className="font-semibold text-gray-900">{t.cart.total}</span>
          <span className="text-2xl font-bold text-emerald-600">
            {formatPrice(total, locale)}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            href="/checkout"
            className="flex-1 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg text-center active:scale-[0.98]"
          >
            {t.cart.checkout}
          </Link>
          <button
            onClick={clearCart}
            className="px-4 py-3.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm"
          >
            {t.common.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
