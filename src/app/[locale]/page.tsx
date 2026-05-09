import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { pickLocalized } from "@/lib/i18n-helpers";
import { type Locale } from "@/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("home");

  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { slug: "asc" } }),
  ]);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="badge mb-4">🇩🇿 Algeria · DZD</span>
            <h1 className="text-3xl font-extrabold leading-tight text-stone-900 md:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-base text-stone-600 md:text-lg">{t("heroSubtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/browse`} className="btn-primary">
                {t("ctaBrowse")}
              </Link>
              <Link href={`/${locale}/sell`} className="btn-secondary">
                {t("ctaSell")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">{t("categories")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/browse?category=${c.slug}`}
              className="card flex flex-col items-center gap-2 p-4 text-center transition hover:bg-brand-50"
            >
              <span className="text-3xl">{c.icon ?? "📦"}</span>
              <span className="text-sm font-medium text-stone-700">
                {pickLocalized(c, "name", locale as Locale)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">{t("featured")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale as Locale} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">{t("whyTitle")}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: "💳", title: t("why1Title"), body: t("why1Body") },
              { icon: "⚡", title: t("why2Title"), body: t("why2Body") },
              { icon: "🛍️", title: t("why3Title"), body: t("why3Body") },
            ].map((f, i) => (
              <div key={i} className="card p-6">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1 font-semibold text-stone-900">{f.title}</h3>
                <p className="text-sm text-stone-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
