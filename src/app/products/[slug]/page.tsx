import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Star, Download, FileText, Shield, Zap, ChevronRight } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, createdAt: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, session] = await Promise.all([getProduct(slug), auth()]);

  if (!product || !product.published) notFound();

  const hasPurchased =
    session?.user &&
    (await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "paid",
        items: { some: { productId: product.id } },
      },
    })) !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-600">الرئيسية</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-emerald-600">المنتجات</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-emerald-600">
          {product.category.nameAr ?? product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{product.nameAr ?? product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Header */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.nameAr ?? product.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <span className="text-7xl opacity-40">📦</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full"
                >
                  {product.category.nameAr ?? product.category.name}
                </Link>
                {product.featured && (
                  <span className="text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">⭐ مميز</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.nameAr ?? product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  {product.rating.toFixed(1)} ({product.reviewCount} تقييم)
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {product.totalSales} مبيعة
                </span>
                {product.fileType && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {product.fileType.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">وصف المنتج</h2>
            <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.descriptionAr ?? product.description}
            </div>
          </div>

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                التقييمات ({product.reviewCount})
              </h2>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs">
                          {review.user.name?.[0] ?? "م"}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.user.name ?? "مستخدم مجهول"}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <div className="text-3xl font-bold text-emerald-700 mb-2">
              {formatPrice(product.price, product.currency)}
            </div>
            <p className="text-sm text-gray-500 mb-5">دفعة واحدة. لا اشتراكات.</p>

            {hasPurchased ? (
              <div className="space-y-3">
                <Link
                  href={`/account/orders`}
                  className="block w-full text-center py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  تحميل المنتج ↓
                </Link>
                <p className="text-xs text-center text-green-600 font-medium">✓ لقد اشتريت هذا المنتج</p>
              </div>
            ) : (
              <AddToCartButton product={product} />
            )}

            {/* Product Info */}
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-3 text-sm">
              {[
                { label: "الفئة", value: product.category.nameAr ?? product.category.name },
                ...(product.fileType ? [{ label: "نوع الملف", value: product.fileType.toUpperCase() }] : []),
                ...(product.fileSize ? [{ label: "حجم الملف", value: product.fileSize }] : []),
                { label: "التسليم", value: "فوري بعد الدفع" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-900 font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Guarantees */}
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
              {[
                { icon: <Shield className="h-4 w-4 text-emerald-600" />, text: "دفع آمن ومشفر" },
                { icon: <Zap className="h-4 w-4 text-emerald-600" />, text: "تسليم فوري بعد الدفع" },
                { icon: <Download className="h-4 w-4 text-emerald-600" />, text: "5 تحميلات مضمونة" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-xs text-gray-600">
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
