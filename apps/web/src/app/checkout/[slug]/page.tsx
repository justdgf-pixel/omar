import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import { formatPrice, getProductBySlug, products } from "@/data/catalog";

type CheckoutPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
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
        <Link href={`/products/${product.slug}`} className="hover:text-emerald-700">
          {product.title}
        </Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <section className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Selected product
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {product.shortDescription}
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-2 text-3xl font-semibold">
              {formatPrice(product.priceDzd)}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
              >
                {feature}
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Buyer details
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Create a demo order
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This simulates the flow you will later connect to a real CIB or
            Edahabia payment confirmation callback.
          </p>

          <div className="mt-8">
            <CheckoutForm product={product} />
          </div>
        </section>
      </section>
    </main>
  );
}
