import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { ArrowLeft, Star, Shield, Zap, Headphones, TrendingUp, ChevronRight } from "lucide-react";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: { where: { published: true } } } } },
    orderBy: { name: "asc" },
    take: 6,
  });
}

async function getStats() {
  const [products, users, orders] = await Promise.all([
    prisma.product.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.order.count({ where: { status: "paid" } }),
  ]);
  return { products, users, orders };
}

const CATEGORY_ICONS: Record<string, string> = {
  software: "💻",
  design: "🎨",
  education: "📚",
  music: "🎵",
  video: "🎬",
  photography: "📷",
  marketing: "📢",
  other: "📦",
};

export default async function HomePage() {
  const [featured, categories, stats] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getStats(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-teal-300 blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="text-yellow-300">⭐</span> منصة رقم 1 للمنتجات الرقمية في الجزائر
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              اشتري وبيع<br />
              <span className="text-emerald-300">المنتجات الرقمية</span><br />
              بسهولة وأمان
            </h1>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              أفضل مكان في الجزائر لشراء البرمجيات، القوالب، الدورات التعليمية والمزيد.
              ادفع بـ CIB، BaridiMob أو BaridiPay.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="xl" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold">
                  تصفح المنتجات <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  ابدأ البيع مجاناً
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
              {[
                { label: "منتج رقمي", value: stats.products.toLocaleString() },
                { label: "عميل سعيد", value: stats.users.toLocaleString() },
                { label: "عملية بيع", value: stats.orders.toLocaleString() },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-emerald-300">{stat.value}+</p>
                  <p className="text-emerald-100 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Banner */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <span className="font-medium text-gray-900">طرق الدفع المقبولة:</span>
            {["💳 CIB", "📱 BaridiMob", "🏦 BaridiPay", "🥇 Dahabiya"].map((m) => (
              <span key={m} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">تصفح حسب الفئة</h2>
              <Link href="/products" className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                عرض الكل <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 text-center"
                >
                  <span className="text-3xl mb-2">
                    {CATEGORY_ICONS[cat.slug] ?? "📦"}
                  </span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">
                    {cat.nameAr ?? cat.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {cat._count.products} منتج
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">المنتجات المميزة</h2>
                <p className="text-gray-500 text-sm mt-1">أفضل المنتجات المختارة بعناية</p>
              </div>
              <Link href="/products" className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                عرض الكل <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">لماذا RakamDZ؟</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              نحن نوفر أفضل تجربة للمبيعات الرقمية في الجزائر
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="h-8 w-8 text-emerald-600" />,
                title: "دفع آمن ومضمون",
                desc: "جميع المعاملات مشفرة ومحمية. ندعم CIB و BaridiMob و BaridiPay.",
              },
              {
                icon: <Zap className="h-8 w-8 text-emerald-600" />,
                title: "تسليم فوري",
                desc: "احصل على ملفاتك فور تأكيد الدفع. لا انتظار، لا تأخير.",
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
                title: "أسعار منافسة",
                desc: "منتجات رقمية عالية الجودة بأسعار مناسبة للجزائريين.",
              },
              {
                icon: <Headphones className="h-8 w-8 text-emerald-600" />,
                title: "دعم متواصل",
                desc: "فريقنا جاهز لمساعدتك في أي وقت. تواصل معنا عبر الواتساب أو البريد.",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-gray-50 border border-gray-100 text-center hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت مبدع جزائري؟</h2>
          <p className="text-emerald-100 text-lg mb-8">
            ابدأ بيع منتجاتك الرقمية اليوم وحقق دخلاً إضافياً. الإنضمام مجاني!
          </p>
          <Link href="/register">
            <Button size="xl" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold">
              ابدأ البيع مجاناً
            </Button>
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">ماذا يقول عملاؤنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "أحمد بن علي", wilaya: "الجزائر", rating: 5, text: "خدمة ممتازة! اشتريت قالب ووردبريس واستلمته فوراً. الجودة أكثر مما توقعت." },
              { name: "سارة خالد", wilaya: "وهران", rating: 5, text: "الدفع بـ BaridiMob سهل جداً. استمررت في الشراء من هنا بثقة تامة." },
              { name: "يوسف مرابط", wilaya: "قسنطينة", rating: 5, text: "وجدت دورة تعليمية في البرمجة بسعر رائع. المنصة نظيفة وسهلة الاستخدام." },
            ].map((review) => (
              <div key={review.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.wilaya}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
