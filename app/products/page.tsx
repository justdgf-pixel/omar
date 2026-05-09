import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const categories = await prisma.category.findMany({ orderBy: { slug: 'asc' } });

  const where: any = { published: true };
  if (searchParams.category) {
    const cat = categories.find((c) => c.slug === searchParams.category);
    if (cat) where.categoryId = cat.id;
  }
  if (searchParams.q) {
    const q = searchParams.q;
    where.OR = [
      { titleAr: { contains: q } },
      { titleFr: { contains: q } },
      { titleEn: { contains: q } },
      { descriptionAr: { contains: q } },
      { descriptionFr: { contains: q } },
      { descriptionEn: { contains: q } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{dict.products}</h1>
          <p className="text-slate-500 mt-1">{products.length} / {dict.products}</p>
        </div>
        <form action="/products" className="flex gap-2">
          <input
            type="text"
            name="q"
            placeholder={dict.search}
            defaultValue={searchParams.q ?? ''}
            className="input md:w-72"
          />
          {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
          <button type="submit" className="btn-primary">{dict.submit}</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/products"
          className={`badge ${!searchParams.category ? 'bg-brand-600 text-white' : 'badge-mute'}`}
        >
          {dict.products}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`badge ${searchParams.category === c.slug ? 'bg-brand-600 text-white' : 'badge-mute'}`}
          >
            {localized(c, 'name', locale)}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">{dict.empty}</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
