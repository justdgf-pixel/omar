import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatDate, formatPrice } from '@/lib/format';
import { getDictionary, getLocale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

async function setStatus(formData: FormData) {
  'use server';
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/');
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  const allowed = ['PENDING_PAYMENT', 'AWAITING_REVIEW', 'PAID', 'CANCELLED', 'REFUNDED'];
  if (!allowed.includes(status)) return;
  await prisma.order.update({
    where: { id },
    data: {
      status: status as any,
      paidAt: status === 'PAID' ? new Date() : null,
    },
  });
  redirect('/admin');
}

export default async function AdminPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/admin');
  if (user!.role !== 'ADMIN') redirect('/');

  const [orders, productCount, userCount, revenue] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { buyer: true, items: true },
    }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: 'PAID' } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{dict.admin}</h1>
        <Link href="/admin/products" className="btn-primary">{dict.products}</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <Stat label="Orders" value={orders.length.toString()} />
        <Stat label="Products" value={productCount.toString()} />
        <Stat label="Users" value={userCount.toString()} />
        <Stat label="Revenue" value={formatPrice(revenue._sum.totalCents ?? 0, locale)} />
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">Recent orders</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="p-3">Order</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Method</th>
              <th className="p-3">Reference</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-mono">
                  <Link href={`/account/orders/${o.number}`} className="hover:underline">{o.number}</Link>
                </td>
                <td className="p-3">{o.buyer.name} <span className="text-slate-500">({o.buyer.email})</span></td>
                <td className="p-3">{o.method}</td>
                <td className="p-3 font-mono text-xs">{o.reference ?? '—'}</td>
                <td className="p-3 font-semibold">{formatPrice(o.totalCents, locale)}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-slate-500">{formatDate(o.createdAt, locale)}</td>
                <td className="p-3">
                  <form action={setStatus} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={o.id} />
                    <select name="status" defaultValue={o.status} className="input py-1 text-xs">
                      <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                      <option value="AWAITING_REVIEW">AWAITING_REVIEW</option>
                      <option value="PAID">PAID</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                    <button type="submit" className="btn-secondary text-xs">↺</button>
                  </form>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-slate-500">{dict.empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-500 uppercase">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
