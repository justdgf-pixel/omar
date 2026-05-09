import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const locale = await getLocale();
  const tt = (k: string) => t(locale, k);

  const [featured, latest, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", featured: true },
      take: 6,
      include: { seller: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      take: 8,
      include: { seller: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { slug: "asc" } }),
  ]);

  return (
    <>
      <section className="hero-bg border-b border-ink-100">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="badge-brand mb-4">🇩🇿 {tt("site.tagline")}</span>
            <h1 className="text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl md:text-5xl">
              {tt("home.hero.title")}
            </h1>
            <p className="mt-4 max-w-prose text-base text-ink-600">
              {tt("home.hero.subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn-primary">
                {tt("home.hero.cta")}
              </Link>
              <Link href="/sell" className="btn-outline">
                {tt("home.hero.sell")}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-500">
              <span className="badge">CIB</span>
              <span className="badge">Edahabia</span>
              <span className="badge">BaridiMob</span>
              <span className="badge">CCP</span>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`card overflow-hidden ${i % 2 ? "translate-y-6" : ""}`}
                >
                  {p.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverImage}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <div className="p-3">
                    <p className="line-clamp-1 text-xs font-semibold text-ink-900">
                      {pickI18nField(
                        p as unknown as Record<string, unknown>,
                        "title",
                        locale,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink-900">
            {tt("home.categories")}
          </h2>
          <Link href="/categories" className="text-sm text-brand-700 hover:underline">
            {tt("nav.categories")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/c/${c.slug}`}
              className="card flex flex-col items-center gap-2 p-4 text-center hover:border-brand-300"
            >
              <span className="text-2xl" aria-hidden>
                {c.icon ?? "📦"}
              </span>
              <span className="text-sm font-medium text-ink-800">
                {pickI18nField(
                  c as unknown as Record<string, unknown>,
                  "name",
                  locale,
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-page py-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-bold text-ink-900">
              {tt("home.featured")}
            </h2>
            <Link href="/catalog" className="text-sm text-brand-700 hover:underline">
              {tt("nav.catalog")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-12">
        <h2 className="mb-6 text-xl font-bold text-ink-900">
          {tt("home.latest")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
