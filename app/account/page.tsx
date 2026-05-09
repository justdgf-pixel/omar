import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, signDownloadToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatDate, formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account');

  const orders = await prisma.order.findMany({
    where: { buyerId: user!.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  const paidItems = orders
    .filter((o) => o.status === 'PAID')
    .flatMap((o) => o.items.map((it) => ({ orderItem: it, order: o })));

  const tokens = await Promise.all(
    paidItems.map(async (p) => signDownloadToken(p.orderItem.id, user!.id))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold">{dict.myAccount}</h1>
      <div className="text-slate-500">{user!.name} · {user!.email}</div>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-3">{dict.myLibrary}</h2>
        {paidItems.length === 0 ? (
          <div className="card p-6 text-center text-slate-500">{dict.empty}</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paidItems.map((p, idx) => (
              <div key={p.orderItem.id} className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.orderItem.product.coverUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="text-xs text-brand-700">{localized(p.orderItem.product.category, 'name', locale)}</div>
                  <div className="font-semibold line-clamp-1">{localized(p.orderItem.product, 'title', locale)}</div>
                  <a
                    className="btn-primary w-full mt-3 text-sm"
                    href={`/api/download?token=${tokens[idx]}`}
                  >
                    {dict.download}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">{dict.myOrders}</h2>
        {orders.length === 0 ? (
          <div className="card p-6 text-center text-slate-500">{dict.empty}</div>
        ) : (
          <div className="card divide-y">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.number}`}
                className="flex items-center gap-4 p-4 hover:bg-slate-50"
              >
                <div className="font-mono text-sm">{o.number}</div>
                <div className="text-sm text-slate-500">{formatDate(o.createdAt, locale)}</div>
                <StatusBadge status={o.status} dict={dict} />
                <div className="ms-auto font-semibold text-brand-700">{formatPrice(o.totalCents, locale)}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status, dict }: { status: string; dict: Record<string, string> }) {
  const map: Record<string, { cls: string; key: string }> = {
    PENDING_PAYMENT:  { cls: 'badge-warn',  key: 'orderPending' },
    AWAITING_REVIEW:  { cls: 'badge-info',  key: 'orderAwaitingReview' },
    PAID:             { cls: 'badge-ok',    key: 'orderPaid' },
    CANCELLED:        { cls: 'badge-error', key: 'orderCancelled' },
    REFUNDED:         { cls: 'badge-mute',  key: 'orderRefunded' },
  };
  const v = map[status] ?? { cls: 'badge-mute', key: status };
  return <span className={v.cls}>{dict[v.key] ?? status}</span>;
}
