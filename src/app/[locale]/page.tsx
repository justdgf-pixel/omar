import Link from "next/link";
import { prisma } from "@/lib/db";
import { localeFieldsFor, tFor, type Locale, isLocale } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  const fields = localeFieldsFor(locale);

  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { seller: true, category: true },
      take: 6,
      orderBy: { createdAt: "desc" }
    }),
    prisma.category.findMany({ take: 8 })
  ]);

  const arrow = locale === "ar" ? "←" : "→";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-sand-100">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="badge w-fit bg-brand-100 text-brand-800">
              <Sparkles size={14} className="me-1.5" /> Algeria · DZD
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/catalog`} className="btn-primary">
                {t("home.hero.cta.shop")}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
              <Link href={`/${locale}/sell`} className="btn-secondary">
                {t("home.hero.cta.sell")}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:max-w-md">
              <Feature
                icon={<Wallet size={18} />}
                title={t("home.payments.title")}
                body="EDAHABIA · CIB · BaridiMob"
              />
              <Feature
                icon={<ShieldCheck size={18} />}
                title="Instant"
                body="Secure download links"
              />
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-brand-200/60 to-sand-200/60 blur-2xl" />
            <div className="card grid grid-cols-2 gap-3 p-4">
              {(featured.length ? featured.slice(0, 4) : Array.from({ length: 4 })).map(
                (p, idx) => (
                  <div
                    key={(p as { id?: string })?.id ?? idx}
                    className="aspect-[4/5] rounded-xl bg-gradient-to-br from-brand-100 to-sand-100 ring-1 ring-slate-100"
                  >
                    {(p as { coverImage?: string | null })?.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={(p as { coverImage?: string }).coverImage!}
                        alt=""
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : null}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("home.categories")}
          </h2>
          <Link
            href={`/${locale}/catalog`}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            {t("nav.catalog")} {arrow}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/catalog?category=${c.slug}`}
              className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-xl">
                {c.icon ?? "📦"}
              </span>
              <span className="font-medium text-slate-900">
                {c[fields.name]}
              </span>
            </Link>
          ))}
          {categories.length === 0 ? (
            <div className="text-sm text-slate-500">No categories yet.</div>
          ) : null}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("home.featured")}
          </h2>
          <Link
            href={`/${locale}/catalog`}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            {t("nav.catalog")} {arrow}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
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
          {featured.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              {t("product.empty")}
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-page mb-16">
        <div className="card flex flex-col items-start gap-4 bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold">{t("home.payments.title")}</h3>
            <p className="mt-1 max-w-xl text-brand-50">
              {t("home.payments.body")}
            </p>
          </div>
          <Link
            href={`/${locale}/sell`}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-brand-700 hover:bg-brand-50"
          >
            {t("home.hero.cta.sell")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  body
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card flex items-start gap-3 p-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
        {icon}
      </span>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{body}</div>
      </div>
    </div>
  );
}
