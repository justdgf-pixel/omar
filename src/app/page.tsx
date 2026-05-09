"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  CreditCard,
  TrendingUp,
  Users,
  Download,
} from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { useLocaleStore } from "@/store/locale";
import { products } from "@/data/products";
import { CATEGORIES } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

export default function HomePage() {
  const { locale, t, isRTL } = useLocaleStore();

  const featuredProducts = products.filter((p) => p.featured);
  const bestsellerProducts = products.filter((p) => p.bestseller);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-40 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className={cn("flex items-center gap-2 mb-6", isRTL && "flex-row-reverse")}>
              <Sparkles size={18} className="text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium tracking-wide uppercase">
                {t.site.tagline}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              {t.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">
                {t.hero.titleHighlight}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/90 mb-8 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className={cn("flex flex-wrap gap-4", isRTL && "flex-row-reverse")}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                {t.hero.cta}
                <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500/20 text-white font-semibold rounded-xl border border-emerald-400/30 hover:bg-emerald-500/30 transition-all"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>

            <div className={cn("flex gap-10 mt-12", isRTL && "flex-row-reverse")}>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-emerald-200 text-sm mt-1">
                  {t.hero.stats.products}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-emerald-200 text-sm mt-1">
                  {t.hero.stats.sellers}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-emerald-200 text-sm mt-1">
                  {t.hero.stats.downloads}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap size={24} />,
                title: locale === "ar" ? "تحميل فوري" : "Téléchargement instantané",
                desc:
                  locale === "ar"
                    ? "احصل على منتجاتك مباشرة بعد الشراء"
                    : "Recevez vos produits immédiatement après l'achat",
              },
              {
                icon: <Shield size={24} />,
                title: locale === "ar" ? "دفع آمن" : "Paiement sécurisé",
                desc:
                  locale === "ar"
                    ? "جميع المعاملات مشفرة ومحمية"
                    : "Toutes les transactions sont cryptées et protégées",
              },
              {
                icon: <CreditCard size={24} />,
                title: locale === "ar" ? "دفع جزائري" : "Paiement local",
                desc:
                  locale === "ar"
                    ? "CIB، الذهبية، بريدي موب و CCP"
                    : "CIB, Dahabia, BaridiMob et CCP",
              },
              {
                icon: <TrendingUp size={24} />,
                title:
                  locale === "ar"
                    ? "محتوى جزائري أصيل"
                    : "Contenu 100% algérien",
                desc:
                  locale === "ar"
                    ? "منتجات مصممة من طرف مبدعين جزائريين"
                    : "Des produits créés par des talents algériens",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t.nav.categories}
            </h2>
            <Link
              href="/products"
              className={cn(
                "text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 text-sm",
                isRTL && "flex-row-reverse"
              )}
            >
              {t.common.viewAll}
              <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors text-center">
                  {locale === "ar" ? cat.nameAr : cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t.products.featured}
            </h2>
            <Link
              href="/products"
              className={cn(
                "text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 text-sm",
                isRTL && "flex-row-reverse"
              )}
            >
              {t.common.viewAll}
              <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t.products.bestsellers}
            </h2>
            <Link
              href="/products?sort=popular"
              className={cn(
                "text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 text-sm",
                isRTL && "flex-row-reverse"
              )}
            >
              {t.common.viewAll}
              <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
          <ProductGrid products={bestsellerProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {locale === "ar"
              ? "هل لديك منتج رقمي؟ ابدأ البيع اليوم!"
              : "Vous avez un produit numérique ? Commencez à vendre !"}
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {locale === "ar"
              ? "انضم إلى أكثر من 500 بائع جزائري وابدأ في تحقيق الدخل من إبداعاتك الرقمية."
              : "Rejoignez plus de 500 vendeurs algériens et commencez à monétiser vos créations numériques."}
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
          >
            {t.hero.ctaSecondary}
            <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
          </Link>
        </div>
      </section>
    </div>
  );
}
