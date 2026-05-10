import Link from "next/link";
import {
  faqItems,
  formatPrice,
  launchSteps,
  paymentRails,
  products,
  trustPoints,
} from "@/data/catalog";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <header className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_rgba(15,23,32,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
            DigiSouk DZ
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Sell digital products in Algeria with a working web flow
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <a
            href="#catalog"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            Explore products
          </a>
          <Link
            href="/admin/orders"
            className="rounded-full bg-slate-950 px-5 py-3 text-white transition hover:bg-emerald-700"
          >
            Demo ops board
          </Link>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="rounded-[2rem] border border-emerald-100 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)] sm:p-10">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
            Catalog, checkout, orders, and downloads
          </span>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Move from a landing page to an actual digital product selling flow.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Buyers can now browse products, open product pages, go through a demo
            checkout, create an order, and unlock a token-based delivery page.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: `${products.length}`, label: "Live product pages" },
              { value: "2", label: "API endpoints" },
              { value: "1", label: "Starter order store" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-3xl font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
            <a
              href="#catalog"
              className="rounded-full bg-white px-5 py-3 text-slate-950 transition hover:bg-emerald-100"
            >
              Browse offers
            </a>
            <a
              href="#payments"
              className="rounded-full border border-white/20 px-5 py-3 text-white transition hover:border-emerald-400 hover:text-emerald-200"
            >
              View payment strategy
            </a>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_12px_50px_rgba(15,23,32,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Starter backend
          </p>
          <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">APIs available</p>
                <h3 className="mt-1 text-xl font-semibold">
                  /api/products and /api/orders
                </h3>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                JSON
              </span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Local order persistence for demo purposes
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Token-based download access after order creation
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Admin page to inspect recent orders
              </li>
            </ul>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              Replace before production
            </p>
            <p className="mt-2 text-sm leading-7 text-emerald-950/80">
              Swap the local JSON store for a database and unlock delivery only
              after a real gateway callback from CIB or Edahabia processing.
            </p>
          </div>
        </aside>
      </section>

      <section
        id="catalog"
        className="mt-12 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Live storefront
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Product pages you can actually click through
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Each product now has its own page and checkout path so you can extend
            the store into a real digital commerce app instead of a static mockup.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.slug}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-sm font-medium text-emerald-700">
                {product.category}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{product.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {product.shortDescription}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xl font-semibold text-slate-950">
                  {formatPrice(product.priceDzd)}
                </span>
                <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800">
                  {product.deliveryLabel}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View product
                </Link>
                <Link
                  href={`/checkout/${product.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
                >
                  Checkout
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="payments"
        className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Why this fits Algeria
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Build trust before you optimize scale
          </h2>
          <ul className="mt-6 space-y-4">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Payments and operations
          </p>
          <div className="mt-6 grid gap-4">
            {paymentRails.map((payment) => (
              <div
                key={payment.title}
                className="rounded-[1.5rem] border border-slate-200 p-5"
              >
                <h3 className="text-xl font-semibold">{payment.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {payment.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)]">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Launch plan
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              What to replace next for production
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The UI and order flow are wired. The next step is to swap demo
              persistence and simulated payment completion for real services.
            </p>
          </div>
          <div className="grid gap-4">
            {launchSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-medium text-emerald-200">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            FAQ
          </p>
          <div className="mt-6 grid gap-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Mobile companion
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            The Expo app now mirrors this richer catalog direction
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            It remains a starter, but it now reflects the same products and
            delivery story so you can continue into a real customer app.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              Catalog cards
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              Payment priorities
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              Delivery roadmap
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
