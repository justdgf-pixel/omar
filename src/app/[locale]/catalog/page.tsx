import { prisma } from "@/lib/db";
import { localeFieldsFor, tFor, type Locale, isLocale } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: { locale: string };
  searchParams: { q?: string; category?: string };
}

export default async function CatalogPage({ params, searchParams }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  const fields = localeFieldsFor(locale);
  const q = searchParams.q?.trim();
  const cat = searchParams.category?.trim();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(cat ? { category: { slug: cat } } : {}),
        ...(q
          ? {
              OR: [
                { titleAr: { contains: q } },
                { titleFr: { contains: q } },
                { titleEn: { contains: q } },
                { descriptionAr: { contains: q } },
                { descriptionFr: { contains: q } },
                { descriptionEn: { contains: q } }
              ]
            }
          : {})
      },
      include: { seller: true, category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.category.findMany()
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("nav.catalog")}</h1>
        <form action={`/${locale}/catalog`} className="flex gap-2">
          {cat ? <input type="hidden" name="category" value={cat} /> : null}
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder={t("common.search")}
            className="input"
          />
          <button className="btn-primary">{t("common.search").replace("...", "")}</button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <CatChip
          href={`/${locale}/catalog`}
          active={!cat}
          label={t("home.categories")}
        />
        {categories.map((c) => (
          <CatChip
            key={c.id}
            href={`/${locale}/catalog?category=${c.slug}`}
            active={cat === c.slug}
            label={`${c.icon ?? "📦"} ${c[fields.name]}`}
          />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            locale={locale}
            messages={{
              addToCart: t("product.addToCart"),
              byAuthor: t("product.byAuthor")
            }}
            product={{
              id: p.id,
              slug: p.slug,
              title: p[fields.title],
              description: p[fields.description],
              priceDzd: p.priceDzd,
              cover: p.coverImage,
              sellerName: p.seller?.name
            }}
          />
        ))}
        {products.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            {t("product.empty")}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CatChip({
  href,
  active,
  label
}: {
  href: string;
  active?: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-sm ring-1 transition ${
        active
          ? "bg-brand-600 text-white ring-brand-600"
          : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  );
}
