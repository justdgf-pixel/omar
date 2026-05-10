import Link from "next/link";
import { formatPrice } from "@/data/catalog";
import { listRecentOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminOrdersPage() {
  const orders = await listRecentOrders();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Demo ops board
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Recent digital product orders
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
          This page reads from the local starter order store so you can inspect
          what has been purchased, which payment method was selected, and which
          delivery link belongs to the order.
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
        {orders.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm leading-7 text-slate-600">
            No demo orders yet. Create one from any product checkout page to see
            the full flow in action.
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      {order.productTitle}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950">
                      {order.customerName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {order.customerEmail} · {order.customerPhone}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString("en-GB")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-emerald-100 px-3 py-2 font-medium text-emerald-900">
                      {formatPrice(order.amountDzd)}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-2 font-medium text-slate-700">
                      {order.paymentMethod}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-2 font-medium text-slate-700">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
                  >
                    View order
                  </Link>
                  <Link
                    href={`/downloads/${order.downloadToken}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
                  >
                    View download
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
