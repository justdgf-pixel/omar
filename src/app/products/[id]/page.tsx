"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Download,
  FileText,
  HardDrive,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLocaleStore } from "@/store/locale";
import { products } from "@/data/products";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import ProductGrid from "@/components/products/ProductGrid";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem, items } = useCartStore();
  const { locale, t, isRTL } = useLocaleStore();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {locale === "ar" ? "المنتج غير موجود" : "Produit non trouvé"}
        </h1>
        <Link
          href="/products"
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {t.common.back}
        </Link>
      </div>
    );
  }

  const isInCart = items.some((i) => i.product.id === product.id);
  const name = locale === "ar" ? product.nameAr : product.name;
  const description =
    locale === "ar" ? product.descriptionAr : product.description;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? calculateDiscount(product.price, product.originalPrice!)
    : 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addItem(product);
    router.push("/checkout");
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        onClick={() => router.back()}
        className={cn(
          "flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 mb-6 text-sm font-medium transition-colors",
          isRTL && "flex-row-reverse"
        )}
      >
        {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        {t.common.back}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl overflow-hidden flex items-center justify-center">
            <span className="text-9xl opacity-30">
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
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
              -{discount}% {t.products.discount}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
              {product.fileType}
            </span>
            {product.bestseller && (
              <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                {t.products.bestsellers}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
            {name}
          </h1>

          <div className={cn("flex items-center gap-4 mb-4", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-gray-800">
                {product.rating}
              </span>
              <span className="text-gray-400 text-sm">
                ({product.reviewCount} {t.products.reviews})
              </span>
            </div>
            <div className={cn("flex items-center gap-1.5 text-gray-500", isRTL && "flex-row-reverse")}>
              <Download size={16} />
              <span className="text-sm">
                {product.downloadCount.toLocaleString()}{" "}
                {t.products.downloads}
              </span>
            </div>
          </div>

          <div className={cn("flex items-center gap-2.5 mb-6 pb-6 border-b border-gray-100", isRTL && "flex-row-reverse")}>
            {product.seller.verified && (
              <BadgeCheck size={18} className="text-blue-500" />
            )}
            <span className="text-gray-600 font-medium">
              {product.seller.name}
            </span>
            {product.seller.verified && (
              <span className="text-xs text-blue-500 font-medium">
                {t.products.verified}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className={cn("flex items-baseline gap-3", isRTL && "flex-row-reverse")}>
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price, locale)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice!, locale)}
                </span>
              )}
            </div>
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <FileText size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">{t.products.fileType}</p>
                <p className="text-sm font-medium text-gray-700">
                  {product.fileType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <HardDrive size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">{t.products.fileSize}</p>
                <p className="text-sm font-medium text-gray-700">
                  {product.fileSize}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              {t.products.buyNow}
            </button>
            <button
              onClick={() => addItem(product)}
              disabled={isInCart}
              className={cn(
                "px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2",
                isInCart
                  ? "bg-emerald-50 text-emerald-600 cursor-default border border-emerald-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98]"
              )}
            >
              <ShoppingCart size={18} />
              {isInCart
                ? locale === "ar"
                  ? "في السلة"
                  : "Dans le panier"
                : t.products.addToCart}
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {t.products.description}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Tags */}
          <div className={cn("flex flex-wrap gap-2 mt-4", isRTL && "flex-row-reverse")}>
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-16">
        <h3 className="font-semibold text-gray-900 mb-4">
          {t.checkout.paymentMethod}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: "cib", label: t.checkout.paymentMethods.cib, color: "blue" },
            { key: "dahabia", label: t.checkout.paymentMethods.dahabia, color: "amber" },
            { key: "baridimob", label: t.checkout.paymentMethods.baridimob, color: "yellow" },
            { key: "ccp", label: t.checkout.paymentMethods.ccp, color: "emerald" },
          ].map((method) => (
            <div
              key={method.key}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs",
                  method.color === "blue" && "bg-blue-600",
                  method.color === "amber" && "bg-amber-500",
                  method.color === "yellow" && "bg-yellow-500",
                  method.color === "emerald" && "bg-emerald-600"
                )}
              >
                {method.key.slice(0, 3).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {method.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === "ar" ? "منتجات مشابهة" : "Produits similaires"}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
