# Souqami — سوقمي

**A marketplace for selling digital products in Algeria.** Buyers pay in **DZD** with **CIB**, **Edahabia**, **BaridiMob** or **CCP transfer**. Sellers upload e‑books, courses, designs, templates, music or software and get paid to their CCP/bank account.

The codebase is a single Next.js 15 application that powers both:

- **the public marketplace site** (`souqami.dz`), and
- **an installable mobile/desktop app** (PWA, with manifest + responsive UI). A native React Native shell can wrap the same backend later — the API and DB are already ready.

## Highlights

- 🇩🇿 **Algeria-first** — DZD currency, 58 wilayas in profiles, Algerian payment rails.
- 🌐 **Tri-lingual** — Arabic (RTL), French, English. Locale switcher in the navbar.
- 💳 **Local payment methods** — CIB / Edahabia (via SATIM, scaffolded), BaridiMob, CCP transfer with proof note + manual admin verification.
- 🔐 **Roles** — `CUSTOMER`, `SELLER`, `ADMIN` with NextAuth (credentials) + Prisma.
- 📦 **Secure delivery** — buyers get HMAC-signed, time-limited download tokens with per-token use limits.
- 🛍️ **Seller dashboard** — upload digital files, set DZD price, track sales & net earnings.
- 🛡️ **Admin dashboard** — approve / reject pending bank-transfer payments with one click.

## Tech

| Layer       | Choice                                                                   |
| ----------- | ------------------------------------------------------------------------ |
| Framework   | Next.js 15 (App Router, RSC) + TypeScript                                |
| Styling     | Tailwind CSS, custom brand palette (Algerian green/red)                  |
| i18n        | `next-intl` with AR / FR / EN message bundles, RTL on `<html dir>`       |
| State       | `zustand` (cart, persisted in `localStorage`)                            |
| Auth        | `next-auth` Credentials provider, bcrypt-hashed passwords                |
| ORM / DB    | Prisma + SQLite locally; switch to PostgreSQL for production             |
| Storage     | Local `public/uploads` for dev; replace with S3/R2/Bunny for production  |

## Quickstart

```bash
cp .env.example .env
npm install
npm run db:push   # creates the SQLite schema
npm run db:seed   # creates demo users + categories + sample products
npm run dev       # http://localhost:3000
```

Demo accounts after seeding:

| Role     | Email                | Password      |
| -------- | -------------------- | ------------- |
| Admin    | `admin@souqami.dz`   | `admin123`    |
| Seller   | `seller@souqami.dz`  | `seller123`   |
| Customer | `customer@souqami.dz`| `customer123` |

The default locale is **Arabic** (`/ar`). Visit `/fr` or `/en` for French / English.

## Project layout

```
prisma/
  schema.prisma         # Users, Products, Orders, OrderItems, DownloadTokens, Payouts
  seed.ts               # Demo users, categories, sample products
src/
  app/
    [locale]/           # All pages live under a locale segment (ar | fr | en)
      page.tsx              # Home (hero, categories, featured)
      browse/page.tsx       # Catalogue with category filter + search
      p/[slug]/page.tsx     # Product detail
      cart/page.tsx         # Cart (zustand)
      checkout/page.tsx     # Payment method selection (CIB/Edahabia/BaridiMob/CCP)
      orders/[id]/page.tsx  # Order status + secure download links
      account/downloads     # Buyer's purchases
      seller/               # Seller dashboard + new product form
      admin/                # Admin: approve pending payments
      auth/login|register/  # Email + password auth
    api/
      auth/[...nextauth]/   # NextAuth handler
      register/             # POST: create account
      orders/               # POST: place an order (creates pending order)
      admin/orders/[id]/    # POST: approve / reject
      seller/products/      # POST: upload product (multipart)
      download/[token]/     # GET:  signed, single-use file delivery
  components/             # Navbar, Footer, ProductCard, AddToCart, etc.
  i18n/                   # config + AR/FR/EN message bundles + request setup
  lib/                    # prisma, auth, money (DZD), download tokens, wilayas
  store/cart.ts           # zustand cart with persist
public/
  manifest.webmanifest    # PWA manifest (installable as an app)
  icon.svg                # App icon
```

## Algerian payment rails

| Method         | Status     | How it works                                                                                        |
| -------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| **CIB**        | scaffolded | Cards from any Algerian bank via the **SATIM** gateway. Plug your merchant credentials in `.env`.    |
| **Edahabia**   | scaffolded | Algérie Poste card, also via SATIM — same gateway, no code changes.                                  |
| **BaridiMob**  | manual     | Buyer sends to the displayed BaridiMob number; admin verifies and approves the order.                |
| **CCP transfer** | manual   | Buyer transfers to the CCP/bank account shown at checkout and pastes the transaction id.            |

For the SATIM integration, fill `SATIM_*` in `.env` (a stub for the redirect flow can be added in `src/lib/satim.ts`). Until then, all card orders fall through to manual confirmation, which is also how most Algerian web shops bootstrap before they get a SATIM contract.

## Secure downloads

When an order is marked `PAID` (either manually by the admin or by a card-callback), `markOrderPaid()` creates one `DownloadToken` per item:

- HMAC-signed (`DOWNLOAD_SIGNING_SECRET`) so the value can't be forged even if the DB is bypassed.
- Time-limited (30 days) and capped at 5 uses.
- `/api/download/[token]` re-checks ownership, expiry, status and use count on every request.

## Going to production

1. Switch Prisma datasource to `postgresql` and update `DATABASE_URL`.
2. Replace local file storage in `src/app/api/seller/products/route.ts` and `/api/download/[token]` with S3/R2/Bunny pre-signed URLs.
3. Set strong `NEXTAUTH_SECRET` and `DOWNLOAD_SIGNING_SECRET`.
4. Sign a SATIM merchant contract and wire `SATIM_*` to the redirect/3-D Secure flow.
5. Configure your bank/CCP details in `.env` so the checkout page shows correct payout instructions.
6. Add an SMTP/transactional email provider (Resend, Postmark) to send order receipts and download links.

## Roadmap

- React Native shell that consumes the same `/api/*` routes.
- SATIM gateway adapter (`src/lib/satim.ts`) with proper return URL handling.
- Email + SMS notifications (order placed / paid / download ready).
- Seller payout workflow with CCP IBAN form and CSV export for the finance team.
- Reviews / ratings and a homepage "Made in Algeria" curation.

---

Made with ❤️ in Algeria 🇩🇿
