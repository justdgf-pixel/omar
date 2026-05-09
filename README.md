# Souk Digital 🇩🇿

A complete, production-leaning starter for **selling digital products in Algeria** — both as a website and an installable app (PWA).

- **Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · SQLite (swap to Postgres in 1 line)
- **Locales**: العربية (RTL) · Français · English
- **Currency**: Algerian Dinar (DZD)
- **Payments**: CCP / Algérie Poste · BaridiMob · CIB / Edahabia (SATIM gateway, with sandbox mock) · Bank transfer
- **Auth**: email + password, JWT-cookie session
- **Roles**: `CUSTOMER`, `SELLER`, `ADMIN`
- **Digital delivery**: short-lived signed download tokens (JWT, 1h)
- **PWA**: manifest + icons → installable on Android/iOS as a standalone app

## Quick start

```bash
cp .env.example .env       # then edit APP_SECRET to a long random string
npm install
npm run setup              # prisma db push + seed sample data
npm run dev                # http://localhost:3000
```

Sample logins (after `npm run setup`):

| Role     | Email              | Password      |
|----------|--------------------|---------------|
| Admin    | admin@souk.dz      | password123   |
| Seller   | seller@souk.dz     | password123   |
| Customer | customer@souk.dz   | password123   |

## Features

### Buyer flow
1. Browse storefront (`/`, `/products`, `/products/[slug]`, `/categories`).
2. Add to cart → `/checkout` (auth required).
3. Pick a payment method:
   - **CCP / BaridiMob / Bank transfer** → instructions are shown; buyer submits a reference; order goes to `AWAITING_REVIEW`. Admin approves in `/admin` → status becomes `PAID`.
   - **CIB / Edahabia** → buyer is redirected to the SATIM gateway. A built-in `/checkout/cib-mock` simulates success/failure for development. In production, swap in real SATIM credentials in `lib/payments.ts` (`cibInitiate` is documented and stubbed).
4. After payment is `PAID`, signed download links appear in `/account` (My Library) and the order page.
5. `/api/download?token=…` verifies the JWT, the session, and the order status before streaming the file from `private-files/`.

### Seller / Admin
- `/seller` — dashboard with revenue, sales count, and product list.
- `/admin` — all orders, status changes, revenue stats.
- `/admin/products` — list + hide.
- `/admin/products/new` — create a product, upload the digital file (stored in `private-files/`, never served publicly except via signed links).

### Internationalisation
- Per-cookie locale (`souk_locale`), switchable from any page (top-right AR/FR/EN switcher).
- Each product, category and UI string has fields for AR / FR / EN.
- HTML `dir` is set per locale (RTL for Arabic).

### PWA / "App"
- `public/manifest.webmanifest` with theme colour, name, icons.
- `public/icons/icon-192.svg`, `icon-512.svg` (maskable).
- Visiting on Chrome/Safari Mobile shows the **Add to home screen** prompt — the website becomes an installable standalone app.

## Going to production

### 1. Switch the database to Postgres
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Then `npx prisma migrate deploy`.

### 2. Configure real payments

`lib/payments.ts` already isolates payment-provider calls. To enable real CIB / Edahabia:

1. Onboard with **SATIM** through your acquiring bank to obtain a Merchant ID + API key.
2. Set `SATIM_MERCHANT_ID` and `SATIM_API_KEY` in your environment.
3. Implement the real `register.do` POST inside `cibInitiate(...)`. SATIM will return an `orderId` and `formUrl`. Redirect the buyer to `formUrl`. On callback, verify with `getOrderStatus.do`, then mark the order `PAID`.

For **CCP / BaridiMob / Bank transfer**, configure your account details in `.env`:
```
PAYMENT_CCP_ACCOUNT="…"
PAYMENT_CCP_NAME="…"
PAYMENT_BARIDIMOB_RIP="…"
```

### 3. File storage
Digital files are stored under `private-files/` on the server. For multi-instance deploys, swap this for S3-compatible storage (e.g. AWS S3, DigitalOcean Spaces, or local providers like Cloud Algérie). The download route just needs to stream bytes — replace the `fs.readFile` call.

### 4. Secrets

- Set `APP_SECRET` to a long random string (≥ 32 chars). It signs sessions and download tokens.
- Use HTTPS in production — session cookies are flagged `secure` automatically.

## Project structure

```
app/                 Next.js App Router pages + API routes
  (storefront)       /, /products, /products/[slug], /categories, /about
  (cart/checkout)    /cart, /checkout, /checkout/cib-mock
  (account)          /account, /account/orders/[number]
  (seller)           /seller
  (admin)            /admin, /admin/products, /admin/products/new
  api/               cart, locale, download, auth/logout
components/          Header, Footer, ProductCard, LocaleSwitcher, AddToCartButton, RemoveFromCart
lib/
  db.ts              Prisma singleton
  auth.ts            JWT session, password hashing, download tokens
  i18n.ts            Locale + dictionary loading
  cart.ts            Cookie-backed cart
  format.ts          DZD price + date formatting
  payments.ts        Algerian payment provider abstraction
  enums.ts           Role / PaymentMethod / OrderStatus unions
messages/            ar.ts, fr.ts, en.ts
prisma/
  schema.prisma      User / Category / Product / Order / OrderItem
  seed.ts            Sample data (3 users, 5 categories, 6 products)
private-files/       Digital files served only via signed links
public/
  covers/            Sample SVG cover images
  icons/             PWA icons (192, 512)
  manifest.webmanifest
```

## Scripts

- `npm run dev` — dev server with hot reload
- `npm run build` — production build (runs `prisma generate` first)
- `npm run start` — start production server
- `npm run db:push` — sync Prisma schema to the database
- `npm run db:seed` — seed sample users, categories, and products
- `npm run setup` — both of the above in one go
- `npm run lint` — ESLint

## Notes for Algeria

- **Currency**: DZD; we store prices as integer **centimes** (1 DZD = 100 c) to avoid float errors.
- **Tax / VAT (TVA)**: not modelled by default. Add a `taxCents` column on `Order` if you sell B2B and need to itemise TVA.
- **Customer support / fraud**: manual order review (CCP / BaridiMob) is intentional — confirming wire transfers manually is the standard practice today in Algeria. Once SATIM is enabled, those CIB / Edahabia orders settle automatically.
- **Mobile-first**: Most Algerian users browse on Android. The UI is tested at 360–430 px wide; the app is installable as a PWA so it appears in the launcher like a native app.

## License

MIT.
