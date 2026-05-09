import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const cat = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: { seller: true, category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!cat) notFound();
  const name = pickI18nField(
    cat as unknown as Record<string, unknown>,
    "name",
    locale,
  );

  return (
    <div className="container-page py-8">
      <p className="text-sm text-ink-500">{t(locale, "nav.categories")}</p>
      <h1 className="mt-1 text-2xl font-bold text-ink-900">
        {cat.icon} {name}
      </h1>

      {cat.products.length === 0 ? (
        <div className="mt-6 card p-10 text-center text-ink-500">
          {t(locale, "common.empty")}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cat.products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
