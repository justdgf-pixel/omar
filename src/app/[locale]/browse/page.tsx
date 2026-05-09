import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { pickLocalized } from "@/lib/i18n-helpers";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { slug: "asc" } }),
    prisma.product.findMany({
      where: {
        published: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(q
          ? {
              OR: [
                { titleAr: { contains: q } },
                { titleFr: { contains: q } },
                { titleEn: { contains: q } },
                { descAr: { contains: q } },
                { descFr: { contains: q } },
                { descEn: { contains: q } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href={`/${locale}/browse`}
          className={`rounded-full px-3 py-1.5 text-sm ${
            !category ? "bg-brand-500 text-white" : "bg-white ring-1 ring-stone-200 hover:bg-stone-50"
          }`}
        >
          {locale === "ar" ? "الكل" : locale === "fr" ? "Tout" : "All"}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/browse?category=${c.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm ${
              category === c.slug
                ? "bg-brand-500 text-white"
                : "bg-white ring-1 ring-stone-200 hover:bg-stone-50"
            }`}
          >
            {c.icon} {pickLocalized(c, "name", locale as Locale)}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="card p-10 text-center text-stone-500">
          {locale === "ar"
            ? "لا توجد منتجات بعد."
            : locale === "fr"
              ? "Aucun produit pour le moment."
              : "No products yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale as Locale} />
          ))}
        </div>
      )}
    </div>
  );
}
