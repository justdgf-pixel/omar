import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';
import { AddToCartButton } from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, seller: { select: { name: true } } },
  });
  if (!product || !product.published) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id }, published: true },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.coverUrl} alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
        <div>
          <Link href={`/products?category=${product.category.slug}`} className="text-sm text-brand-700 hover:underline">
            {localized(product.category, 'name', locale)}
          </Link>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold">{localized(product, 'title', locale)}</h1>
          <div className="mt-1 text-slate-500 text-sm">{product.seller.name}</div>
          <div className="mt-4 text-3xl font-bold text-brand-700">{formatPrice(product.priceCents, locale)}</div>
          <p className="mt-4 text-slate-700 leading-relaxed">{localized(product, 'description', locale)}</p>
          <div className="mt-6 flex gap-3">
            <AddToCartButton productId={product.id} label={dict.addToCart} buyNowLabel={dict.buyNow} />
          </div>
          <div className="mt-6 text-xs text-slate-500">
            {(product.fileSize / 1024).toFixed(1)} KB · {product.fileName}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">{dict.products}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.coverUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{localized(p, 'title', locale)}</div>
                  <div className="text-brand-700 font-bold mt-1">{formatPrice(p.priceCents, locale)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
