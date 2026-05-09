import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

type Search = { q?: string; sort?: string };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const sort = sp.sort ?? "new";

  const orderBy =
    sort === "price_asc"
      ? { priceDzd: "asc" as const }
      : sort === "price_desc"
        ? { priceDzd: "desc" as const }
        : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
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
    include: { seller: true, category: true },
    orderBy,
  });

  const categories = await prisma.category.findMany({ orderBy: { slug: "asc" } });

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-ink-900">{t(locale, "nav.catalog")}</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">
            {t(locale, "nav.categories")}
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/catalog"
                className="block rounded-lg px-2 py-1.5 hover:bg-ink-100"
              >
                — {t(locale, "common.continue")}
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/c/${c.slug}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-100"
                >
                  <span aria-hidden>{c.icon ?? "📦"}</span>
                  <span>
                    {pickI18nField(
                      c as unknown as Record<string, unknown>,
                      "name",
                      locale,
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <form
            method="get"
            className="mb-5 flex flex-wrap items-center gap-2"
          >
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={t(locale, "common.search")}
              className="input flex-1 min-w-[200px]"
            />
            <select name="sort" defaultValue={sort} className="input w-auto">
              <option value="new">— {t(locale, "home.latest")}</option>
              <option value="price_asc">$ ↑</option>
              <option value="price_desc">$ ↓</option>
            </select>
            <button className="btn-primary">{t(locale, "common.search")}</button>
          </form>

          {products.length === 0 ? (
            <div className="card p-10 text-center text-ink-500">
              {t(locale, "common.empty")}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
