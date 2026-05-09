import Link from 'next/link';
import { redirect } from 'next/navigation';
import { readCart, expandCart, cartTotalCents, clearCartCookie } from '@/lib/cart';
import { getDictionary, getLocale, localized } from '@/lib/i18n';
import { formatPrice, generateOrderNumber } from '@/lib/format';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPaymentInstructions, cibInitiate } from '@/lib/payments';
import type { PaymentMethod } from '@/lib/enums';

export const dynamic = 'force-dynamic';

async function placeOrder(formData: FormData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/checkout');
  const items = readCart();
  const rows = await expandCart(items);
  if (rows.length === 0) redirect('/cart');

  const method = String(formData.get('method') ?? 'CCP') as PaymentMethod;
  const reference = String(formData.get('reference') ?? '').trim() || null;
  const notes = String(formData.get('notes') ?? '').trim() || null;
  const total = cartTotalCents(rows);

  const order = await prisma.order.create({
    data: {
      number: generateOrderNumber(),
      buyerId: user!.id,
      status: method === 'CIB_EDAHABIA' ? 'PENDING_PAYMENT' : 'AWAITING_REVIEW',
      totalCents: total,
      method,
      reference,
      notes,
      items: {
        create: rows.map((r) => ({
          productId: r.product.id,
          priceCents: r.product.priceCents,
          titleSnapshot: r.product.titleEn,
        })),
      },
    },
  });

  clearCartCookie();

  if (method === 'CIB_EDAHABIA') {
    const { redirectUrl } = await cibInitiate({
      orderNumber: order.number,
      amountCents: total,
      returnUrl: `/account/orders/${order.number}`,
    });
    redirect(redirectUrl);
  }

  redirect(`/account/orders/${order.number}?placed=1`);
}

export default async function CheckoutPage({ searchParams }: { searchParams: { method?: string } }) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/checkout');

  const items = readCart();
  const rows = await expandCart(items);
  if (rows.length === 0) redirect('/cart');
  const total = cartTotalCents(rows);
  const selected = (searchParams.method as PaymentMethod) ?? 'CCP';
  const inst = getPaymentInstructions(selected);

  const methods: { value: PaymentMethod; label: string }[] = [
    { value: 'CCP',          label: dict.paymentCcp },
    { value: 'BARIDIMOB',    label: dict.paymentBaridimob },
    { value: 'CIB_EDAHABIA', label: dict.paymentCib },
    { value: 'BANK_TRANSFER',label: dict.paymentBankTransfer },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-[1fr,360px] gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{dict.checkout}</h1>
        <div className="card p-4">
          <div className="font-semibold">{dict.paymentMethods}</div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {methods.map((m) => (
              <Link
                key={m.value}
                href={`/checkout?method=${m.value}`}
                className={`p-3 rounded-lg border text-sm font-medium text-center ${
                  selected === m.value ? 'bg-brand-50 border-brand-300 text-brand-800' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-4 mt-4">
          <div className="font-semibold">{inst.title}</div>
          {inst.beneficiary && (
            <div className="mt-2 text-sm">
              <span className="text-slate-500">Bénéficiaire :</span>{' '}
              <span className="font-medium">{inst.beneficiary}</span>
            </div>
          )}
          {inst.account && (
            <div className="text-sm">
              <span className="text-slate-500">Compte :</span>{' '}
              <span className="font-mono ltr-numbers">{inst.account}</span>
            </div>
          )}
          <div className="mt-3 text-sm font-medium">{dict.paymentInstructions}</div>
          <ol className="mt-2 list-decimal ms-5 space-y-1 text-sm text-slate-700">
            {inst.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>

        <form action={placeOrder} className="card p-4 mt-4 space-y-3">
          <input type="hidden" name="method" value={selected} />
          <div>
            <label className="label">{dict.uploadProofOptional}</label>
            <input className="input" type="text" name="reference" placeholder="N° bordereau / transaction" />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" name="notes" rows={2} />
          </div>
          <button type="submit" className="btn-primary w-full">{dict.placeOrder}</button>
        </form>
      </div>

      <aside className="card p-4 h-fit sticky top-20">
        <div className="font-semibold mb-3">{dict.cart}</div>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.product.id} className="flex items-center gap-2 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.product.coverUrl} alt="" className="h-10 w-10 rounded object-cover" />
              <div className="flex-1 min-w-0 line-clamp-1">{localized(r.product, 'title', locale)}</div>
              <div className="font-medium">{formatPrice(r.product.priceCents, locale)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <span className="text-slate-600">{dict.total}</span>
          <span className="text-xl font-bold text-brand-700">{formatPrice(total, locale)}</span>
        </div>
      </aside>
    </div>
  );
}
