import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function SellerPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/seller');
  if (user!.role !== 'SELLER' && user!.role !== 'ADMIN') redirect('/');

  const products = await prisma.product.findMany({
    where: { sellerId: user!.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  const sales = await prisma.orderItem.findMany({
    where: { product: { sellerId: user!.id }, order: { status: 'PAID' } },
    include: { order: true },
  });
  const totalRevenue = sales.reduce((s, x) => s + x.priceCents, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{dict.sellerDashboard}</h1>
        {user!.role === 'ADMIN' && (
          <Link href="/admin/products/new" className="btn-primary">+ {dict.products}</Link>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Products</div><div className="text-2xl font-bold">{products.length}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Sales</div><div className="text-2xl font-bold">{sales.length}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Revenue</div><div className="text-2xl font-bold">{formatPrice(totalRevenue, locale)}</div></div>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-3">{dict.products}</h2>
      <div className="card divide-y">
        {products.map((p) => (
          <div key={p.id} className="p-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.coverUrl} alt="" className="h-12 w-12 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-medium line-clamp-1">{localized(p, 'title', locale)}</div>
              <div className="text-xs text-slate-500">{localized(p.category, 'name', locale)}</div>
            </div>
            <div className="font-semibold text-brand-700">{formatPrice(p.priceCents, locale)}</div>
            <Link href={`/products/${p.slug}`} className="btn-secondary text-xs">View</Link>
          </div>
        ))}
        {products.length === 0 && (
          <div className="p-6 text-center text-slate-500">{dict.empty}</div>
        )}
      </div>
    </div>
  );
}
