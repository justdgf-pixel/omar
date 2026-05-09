import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';

export default async function CategoriesPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const cats = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold">{dict.categories}</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {cats.map((c) => (
          <Link key={c.id} href={`/products?category=${c.slug}`} className="card p-5 hover:bg-brand-50">
            <div className="font-semibold">{localized(c, 'name', locale)}</div>
            <div className="text-sm text-slate-500">{c._count.products} {dict.products}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
