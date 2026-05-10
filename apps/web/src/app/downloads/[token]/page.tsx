import Link from "next/link";
import { notFound } from "next/navigation";
import { findOrderByDownloadToken } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DownloadPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params;
  const order = await findOrderByDownloadToken(token);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
          Digital delivery
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Download unlocked for {order.productTitle}
        </h1>
        <p className="mt-4 text-sm leading-8 text-slate-300">
          This page simulates secure delivery after a successful transaction. The
          file below is a starter asset that proves the flow end to end.
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              File ready
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {order.productTitle}
            </h2>
          </div>
          <a
            href={order.assetPath}
            download
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Download sample file
          </a>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          Replace this sample asset with your real PDF, archive, course invite, or
          license delivery logic. The important part is that the order record and
          tokenized access are already wired together.
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/orders/${order.id}`}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            Back to order
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
