const products = [
  {
    title: "Ramadan recipe ebook",
    category: "Ebooks",
    price: "2,500 DZD",
    description:
      "Sell downloadable guides, premium PDFs, and printable packs with instant delivery after confirmation.",
  },
  {
    title: "Canva business pack",
    category: "Templates",
    price: "4,800 DZD",
    description:
      "Bundle social media templates, brand kits, invoices, and proposals for Algerian freelancers and agencies.",
  },
  {
    title: "Arabic coding course",
    category: "Courses",
    price: "12,000 DZD",
    description:
      "Offer paid videos, source files, and community access to students who prefer mobile-first learning.",
  },
];

const paymentRails = [
  {
    title: "CIB cards",
    body: "For banked customers using SATIM-backed online card payments.",
  },
  {
    title: "Edahabia",
    body: "A core local payment method for broad reach through Algerie Poste.",
  },
  {
    title: "BaridiMob confirmation",
    body: "Useful for trust-building, reminders, and post-payment support flows.",
  },
];

const launchSteps = [
  "Register your activity, merchant account, and e-commerce paperwork before going live.",
  "Connect an approved gateway such as Chargily, SofizPay, or another local processor once the account is approved.",
  "Automate digital delivery by product type: file download, course access, license key, or invite link.",
];

const trustPoints = [
  "Instant access after payment confirmation",
  "Arabic/French-friendly product pages",
  "Mobile-first checkout with WhatsApp support fallback",
  "Ready to extend into seller dashboards, coupons, and analytics",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 text-slate-900 sm:px-10 lg:px-12">
      <header className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_rgba(15,23,32,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
            DigiSouk DZ
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Sell digital products in Algeria with local-first UX
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <a
            href="#catalog"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            Explore catalog
          </a>
          <a
            href="#launch"
            className="rounded-full bg-slate-950 px-5 py-3 text-white transition hover:bg-emerald-700"
          >
            Launch checklist
          </a>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="rounded-[2rem] border border-emerald-100 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)] sm:p-10">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
            Algeria-ready digital commerce starter
          </span>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Launch a storefront for ebooks, design packs, courses, and private
            downloads.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            This MVP combines a landing site, product catalog, and checkout
            experience designed around how Algerian buyers discover, trust, and
            pay for digital goods.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: "3", label: "Core product formats" },
              { value: "2", label: "Channels included" },
              { value: "100%", label: "Mobile-first layout" },
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
              href="#payments"
              className="rounded-full bg-white px-5 py-3 text-slate-950 transition hover:bg-emerald-100"
            >
              View payment strategy
            </a>
            <a
              href="#mobile"
              className="rounded-full border border-white/20 px-5 py-3 text-white transition hover:border-emerald-400 hover:text-emerald-200"
            >
              Match the mobile app
            </a>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_12px_50px_rgba(15,23,32,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Checkout preview
          </p>
          <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Selected product</p>
                <h3 className="mt-1 text-xl font-semibold">
                  Freelancer starter bundle
                </h3>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                6,900 DZD
              </span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                20 editable Canva templates
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Arabic + French invoice pack
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                Download link unlocked after payment confirmation
              </li>
            </ul>

            <div className="mt-5 grid gap-3">
              {paymentRails.map((payment) => (
                <div
                  key={payment.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <p className="font-medium">{payment.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{payment.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              Best next backend step
            </p>
            <p className="mt-2 text-sm leading-7 text-emerald-950/80">
              Add a real products table, order records, download tokens, and a
              payment webhook once your local gateway account is approved.
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
              Starter catalog
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Digital offers that fit the local market
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Start with low-friction products that can be delivered instantly,
            then expand into subscriptions, memberships, and creator bundles.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.title}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-sm font-medium text-emerald-700">
                {product.category}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{product.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {product.description}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xl font-semibold text-slate-950">
                  {product.price}
                </span>
                <span className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800">
                  Instant delivery
                </span>
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
          <p className="mt-6 text-sm leading-7 text-slate-600">
            For production, connect an approved gateway and validate legal/tax
            requirements for your activity, invoices, VAT handling, and digital
            delivery records before processing real orders.
          </p>
        </div>
      </section>

      <section
        id="launch"
        className="mt-12 rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,32,0.16)]"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Launch plan
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              What to build next after this starter
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              This repository gives you the positioning, product pages, and app
              concept. The next engineering layer is backend automation and real
              payments.
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

      <section
        id="mobile"
        className="mt-12 mb-8 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_12px_50px_rgba(15,23,32,0.06)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Mobile companion
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              The app mirrors the same catalog and purchase story
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            The Expo app included in this repo is a clean starting point for a
            buyer mobile experience, catalog browsing, and later account access.
          </p>
        </div>
      </section>
    </main>
  );
}
