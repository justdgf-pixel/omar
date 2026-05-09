import Link from 'next/link';
import { readCart, expandCart, cartTotalCents } from '@/lib/cart';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';
import { RemoveFromCart } from '@/components/RemoveFromCart';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const items = readCart();
  const rows = await expandCart(items);
  const total = cartTotalCents(rows);

  if (rows.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{dict.yourCartIsEmpty}</h1>
        <Link href="/products" className="btn-primary mt-6 inline-flex">{dict.goShop}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{dict.cart}</h1>
      <div className="card divide-y">
        {rows.map((r) => (
          <div key={r.product.id} className="flex items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.product.coverUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <Link href={`/products/${r.product.slug}`} className="font-semibold hover:underline line-clamp-1">
                {localized(r.product, 'title', locale)}
              </Link>
              <div className="text-xs text-slate-500">{localized(r.product.category, 'name', locale)}</div>
            </div>
            <div className="font-semibold text-brand-700">{formatPrice(r.product.priceCents, locale)}</div>
            <RemoveFromCart productId={r.product.id} label={dict.remove} />
          </div>
        ))}
      </div>
      <div className="card p-4 mt-6 flex items-center justify-between">
        <span className="text-slate-600">{dict.total}</span>
        <span className="text-2xl font-bold text-brand-700">{formatPrice(total, locale)}</span>
      </div>
      <div className="mt-6 flex justify-end">
        <Link href="/checkout" className="btn-primary">{dict.checkout}</Link>
      </div>
    </div>
  );
}
