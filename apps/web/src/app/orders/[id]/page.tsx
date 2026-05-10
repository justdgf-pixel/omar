import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/data/catalog";
import { findOrderById } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await findOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)] sm:p-10">
        <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
          Order confirmed in demo mode
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          {order.productTitle} is ready
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
          This confirmation page proves the product, checkout, order, and
          delivery flow are wired together. In production, this state should be
          reached only after the payment provider confirms the charge.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Order details
          </p>
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">Order ID</p>
              <p className="mt-1 break-all font-medium text-slate-950">{order.id}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">Buyer</p>
              <p className="mt-1 font-medium text-slate-950">{order.customerName}</p>
              <p className="mt-1">{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">Payment method</p>
              <p className="mt-1 font-medium text-slate-950">
                {order.paymentMethod}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-slate-500">Amount</p>
              <p className="mt-1 font-medium text-slate-950">
                {formatPrice(order.amountDzd)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Delivery
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Open your download
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The download page is token-based in this starter to demonstrate how a
            protected delivery step should work.
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-900">
              Delivery type
            </p>
            <p className="mt-2 text-sm leading-7 text-emerald-950/80">
              {order.deliveryLabel}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/downloads/${order.downloadToken}`}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Go to download
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              View demo ops board
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
