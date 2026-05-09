import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { ProductCard } from '@/components/ProductCard';

export default async function HomePage() {
  const locale = getLocale();
  const dict = getDictionary(locale);

  const featured = await prisma.product.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
  const fresh = await prisma.product.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
  const categories = await prisma.category.findMany();

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              <span>🇩🇿 {dict.tagline}</span>
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              {dict.heroTitle}
            </h1>
            <p className="mt-4 text-white/80 text-lg">{dict.heroSubtitle}</p>
            <div className="mt-6 flex gap-3">
              <Link href="/products" className="btn-primary bg-white text-brand-800 hover:bg-brand-50">{dict.ctaShop}</Link>
              <Link href="/signup" className="btn-secondary bg-transparent text-white border-white/40 hover:bg-white/10">{dict.ctaSell}</Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {featured.slice(0, 4).map((p) => (
              <div key={p.id} className="card overflow-hidden bg-white text-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.coverUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="text-xs text-brand-700">{localized(p.category, 'name', locale)}</div>
                  <div className="text-sm font-semibold line-clamp-1">{localized(p, 'title', locale)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">{dict.featured}</h2>
          <Link href="/products" className="text-sm text-brand-700 hover:underline">→</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{dict.categories}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="card p-4 text-center hover:bg-brand-50 hover:border-brand-200 transition"
            >
              <div className="font-semibold text-slate-800">{localized(c, 'name', locale)}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{dict.newArrivals}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">{dict.whyUs}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-brand-100 text-brand-700 font-bold">{i}</div>
                <div className="mt-3 font-semibold">{(dict as any)[`whyUs${i}Title`]}</div>
                <p className="text-slate-600 text-sm mt-1">{(dict as any)[`whyUs${i}Body`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
