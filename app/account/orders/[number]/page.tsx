import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, signDownloadToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatDate, formatPrice } from '@/lib/format';
import { getPaymentInstructions } from '@/lib/payments';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { number: string };
  searchParams: { placed?: string };
}) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const order = await prisma.order.findUnique({
    where: { number: params.number },
    include: { items: { include: { product: { include: { category: true } } } } },
  });
  if (!order) notFound();
  if (order.buyerId !== user!.id && user!.role !== 'ADMIN') notFound();

  const inst = getPaymentInstructions(order.method as any);
  const tokens = order.status === 'PAID'
    ? await Promise.all(order.items.map((it) => signDownloadToken(it.id, user!.id)))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/account" className="text-sm text-brand-700 hover:underline">← {dict.myAccount}</Link>
      {searchParams.placed && (
        <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 p-4">
          {dict.orderPlaced}
        </div>
      )}
      <h1 className="mt-3 text-2xl font-bold">#{order.number}</h1>
      <div className="text-sm text-slate-500">{formatDate(order.createdAt, locale)} · {inst.title}</div>

      <div className="card mt-4 divide-y">
        {order.items.map((it, i) => (
          <div key={it.id} className="p-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.product.coverUrl} alt="" className="h-14 w-14 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold line-clamp-1">{localized(it.product, 'title', locale)}</div>
              <div className="text-xs text-slate-500">{localized(it.product.category, 'name', locale)}</div>
            </div>
            <div className="font-medium">{formatPrice(it.priceCents, locale)}</div>
            {order.status === 'PAID' ? (
              <a className="btn-primary text-sm" href={`/api/download?token=${tokens[i]}`}>{dict.download}</a>
            ) : (
              <span className="badge-mute">{dict.download_locked}</span>
            )}
          </div>
        ))}
        <div className="p-4 flex items-center justify-between bg-slate-50">
          <span className="font-medium">{dict.total}</span>
          <span className="text-xl font-bold text-brand-700">{formatPrice(order.totalCents, locale)}</span>
        </div>
      </div>

      {order.status !== 'PAID' && (
        <div className="card mt-4 p-4">
          <div className="font-semibold">{inst.title}</div>
          {inst.beneficiary && <div className="text-sm mt-2">{inst.beneficiary}</div>}
          {inst.account && <div className="text-sm font-mono ltr-numbers">{inst.account}</div>}
          <ol className="mt-3 list-decimal ms-5 space-y-1 text-sm text-slate-700">
            {inst.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          {order.reference && (
            <div className="mt-3 text-sm">
              <span className="text-slate-500">Référence :</span>{' '}
              <span className="font-mono">{order.reference}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
