import Link from 'next/link';
import type { Product, Category } from '@prisma/client';
import { type Locale, localized } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';

export function ProductCard({
  product,
  locale,
}: {
  product: Product & { category: Category };
  locale: Locale;
}) {
  return (
    <Link href={`/products/${product.slug}`} className="card overflow-hidden group flex flex-col">
      <div className="aspect-[4/3] bg-slate-50 grid place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.coverUrl} alt="" className="object-cover w-full h-full group-hover:scale-105 transition" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-brand-700 font-medium">{localized(product.category, 'name', locale)}</div>
        <div className="mt-1 font-semibold text-slate-800 line-clamp-2">{localized(product, 'title', locale)}</div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-brand-700 font-bold">{formatPrice(product.priceCents, locale)}</span>
          {product.featured && <span className="badge-info">★</span>}
        </div>
      </div>
    </Link>
  );
}
