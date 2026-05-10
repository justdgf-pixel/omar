import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProductBySlug, products } from "@/data/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <Link href="/" className="hover:text-emerald-700">
          Home
        </Link>
        <span>/</span>
        <span>{product.category}</span>
      </div>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)] sm:p-10">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
            {product.category}
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            {product.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            {product.headline}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-8 text-slate-300">
            {product.longDescription}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Price</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatPrice(product.priceDzd)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Delivery</p>
              <p className="mt-2 text-2xl font-semibold">{product.deliveryLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Formats</p>
              <p className="mt-2 text-xl font-semibold">
                {product.formats.join(" / ")}
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_12px_50px_rgba(15,23,32,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Checkout summary
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Selected offer</p>
                <h2 className="mt-1 text-xl font-semibold">{product.title}</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
                {formatPrice(product.priceDzd)}
              </span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-2xl border border-white bg-white p-3"
                >
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={`/checkout/${product.slug}`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue to checkout
            </Link>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-900">
              Payment methods to support
            </p>
            <p className="mt-2 text-sm leading-7 text-emerald-950/80">
              {product.paymentHints.join(", ")}.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Included in this product
          </p>
          <div className="mt-6 grid gap-3">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Best audience fit
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {product.audience.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800"
              >
                {audience}
              </span>
            ))}
          </div>

          <p className="mt-8 text-sm leading-8 text-slate-600">
            This product page is now wired into the demo checkout and delivery
            flow. Replace the local JSON persistence with a real orders database
            and a gateway webhook before launch.
          </p>
        </div>
      </section>
    </main>
  );
}
