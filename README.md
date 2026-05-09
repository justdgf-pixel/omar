# Souk Digital

A marketplace for selling **digital products** (e-books, courses, templates, software, music, datasets…) tailored for **Algeria**.
A single Next.js codebase serves both:

- the **website** (responsive, RTL Arabic + French + English),
- the **app** experience as a **PWA** (installable on Android/iOS/desktop).

## Why this stack

- **Next.js 14 + TypeScript + Tailwind** — fast SSR, modern UI, shared codebase for web + PWA.
- **Prisma + SQLite** in dev (one-command setup) → swap to **PostgreSQL** for production by changing `provider` in `prisma/schema.prisma` and `DATABASE_URL`.
- **NextAuth (credentials)** — email/password with bcrypt; easy to extend later.
- **Chargily Pay v2** — Algeria's leading payment gateway supporting **EDAHABIA** and **CIB** cards (the only realistic way to accept local digital payments today). The app falls back to a built-in **mock checkout** when no key is set, so you can demo the full flow locally.
- **BaridiMob / bank transfer** are first-class as offline confirmation methods.
- **i18n**: routing under `/[locale]/...` with `ar` (default, RTL), `fr`, and `en`.

## Quick start

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open <http://localhost:3000> — you'll be redirected to `/ar`.

Seed accounts (password: `password123`):
- `admin@souk.dz` (admin)
- `seller@souk.dz` (seller, owns sample products)

## Payments — Algeria specifics

Algeria has limited international payment rails (Stripe, PayPal etc. don't support local debit). The app integrates **Chargily Pay** to charge the dominant local cards:

- **EDAHABIA** (Algérie Poste)
- **CIB** (SATIM network)

Set these env vars (see `.env.example`):

```
CHARGILY_SECRET_KEY=...
CHARGILY_WEBHOOK_SECRET=...
CHARGILY_MODE=test
```

Webhook receiver: `POST /api/payments/webhook`. We verify the HMAC-SHA256 signature with `CHARGILY_WEBHOOK_SECRET`.

When `CHARGILY_SECRET_KEY` is not set, `/checkout` redirects to a **mock payment page** so you can exercise success/failure paths end-to-end during development.

For payment methods that are inherently offline (**BaridiMob**, **bank transfer**), the order is created as `PENDING` and the user is shown manual instructions; an admin (or a webhook from your bank's CSV import) can mark the order `PAID` later.

## Digital delivery

Buyers see their downloads on `/[locale]/dashboard`. Each download link is a **signed, expiring token** validated server-side in `/api/downloads/[token]`. Files are served only when:

1. the user is the order owner,
2. the order status is `PAID`,
3. the token is still within its TTL (default 1 hour).

The dev demo stores files in `public/uploads/files/`. For production, swap the `fs` calls in `src/app/api/products/route.ts` and `src/app/api/downloads/[token]/route.ts` for an S3-compatible client (DigitalOcean Spaces, Bunny, Cloudflare R2 — all reachable from Algeria).

## i18n / RTL

- Default locale `ar` is right-to-left. The root layout reads the `x-locale` header (set by `src/middleware.ts`) to render `<html lang dir>` correctly during SSR — no flash of wrong direction.
- Translations live in `src/lib/i18n.ts`. Product / category records carry `*Ar`, `*Fr`, `*En` columns so listings stay localized.

## PWA

`public/manifest.webmanifest` plus `public/sw.js` (registered only in production from `RegisterSW`). Installable from any modern browser ("Add to Home Screen"). Theme color and icons are in `public/icons/`.

## Project layout

```
src/
  app/
    [locale]/             # localized pages (home, catalog, product, cart, checkout, dashboard, sell, auth)
    api/                  # auth, checkout, products, downloads, payments (webhook + mock)
  components/             # Header, Footer, ProductCard, Cart context, Providers
  lib/                    # db, auth, chargily, downloads, money, i18n
  middleware.ts           # locale routing + injects x-locale header
prisma/
  schema.prisma           # User / Product / Category / Order / OrderItem / Payout
  seed.ts
public/
  icons/, manifest.webmanifest, sw.js
```

## Going to production

- Switch `prisma/schema.prisma` to `provider = "postgresql"` and point `DATABASE_URL` at a managed Postgres.
- Move uploads to object storage and replace local `fs` reads/writes.
- Configure a real `NEXTAUTH_SECRET`, `DOWNLOAD_SIGNING_SECRET`, and Chargily credentials.
- Behind your CDN, add HSTS + the `Permissions-Policy` defaults; we already send `Cache-Control: private, no-store` on download responses.
- Add an admin moderation UI under `/[locale]/admin` (gated by `session.user.role === "ADMIN"`).
