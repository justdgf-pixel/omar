import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";

export default async function CategoriesPage() {
  const locale = await getLocale();
  const cats = await prisma.category.findMany({
    orderBy: { slug: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-ink-900">
        {t(locale, "nav.categories")}
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/c/${c.slug}`}
            className="card flex flex-col items-center gap-2 p-6 text-center hover:border-brand-300"
          >
            <span className="text-3xl" aria-hidden>
              {c.icon ?? "📦"}
            </span>
            <span className="text-sm font-semibold text-ink-900">
              {pickI18nField(
                c as unknown as Record<string, unknown>,
                "name",
                locale,
              )}
            </span>
            <span className="text-xs text-ink-500">
              {c._count.products} produits
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
