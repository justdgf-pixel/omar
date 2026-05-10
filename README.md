# DigiSouk DZ starter

An Algeria-focused starter for selling digital products through:

- a web storefront built with Next.js
- a mobile app starter built with Expo
- launch notes tailored to local payments and go-to-market realities

## What is included

### Web app

Located in `apps/web`.

It currently includes:

- a landing page with Algeria-specific positioning
- real product detail pages for a starter catalog
- demo checkout pages for each product
- order confirmation and token-based download pages
- `/api/products` and `/api/orders` endpoints
- a demo ops page at `/admin/orders`

### Mobile app

Located in `apps/mobile`.

It currently includes:

- a branded mobile home screen
- featured products and local payment messaging
- a purchase flow preview aligned with the web experience
- a clear structure for evolving into a real buyer app

## Quick start

### Website

```bash
npm run dev:web
```

### Mobile app

```bash
npm run start:mobile
```

### Verification

```bash
npm run verify
```

## Web routes included

- `/` - storefront landing page
- `/products/[slug]` - product detail page
- `/checkout/[slug]` - demo checkout
- `/orders/[id]` - order confirmation
- `/downloads/[token]` - token-based delivery page
- `/admin/orders` - demo operations board

## Starter backend details

The web app includes a lightweight demo data layer:

- `apps/web/src/data/catalog.ts` stores product and storefront content
- `apps/web/src/lib/orders.ts` manages order records
- `apps/web/data/orders.local.json` is created locally on demand and ignored by git

This is intentional starter infrastructure. Replace it with a real database and
payment webhook flow before launch.

## Algeria-specific notes

This starter is designed around common local e-commerce expectations:

- CIB and Edahabia should be treated as core online payment options
- BaridiMob and WhatsApp support flows can help reduce trust friction
- digital delivery must be immediate and explicit after confirmed payment
- merchant registration, invoices, tax treatment, and gateway approval should
  be validated before real launch

For a more detailed checklist, see
[`docs/algeria-launch-checklist.md`](docs/algeria-launch-checklist.md).

## Suggested next engineering steps

1. Add authentication for buyers and sellers.
2. Replace local order storage with a real database.
3. Add payment webhook handling and only unlock delivery after confirmation.
4. Integrate a local payment gateway after business approval.
5. Add Arabic/French localization, analytics, and seller onboarding.
