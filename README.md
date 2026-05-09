# Souk Digital DZ 🇩🇿

A modern marketplace for selling **digital products in Algeria** — built as both a
responsive web site and an installable PWA, with first-class support for Algerian
realities: Arabic / French / English UI, **DZD** currency, and **local payment
methods** (CIB, Edahabia, BaridiMob, CCP, RIB).

> Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**,
> **Prisma + SQLite** (swappable to Postgres), and **JWT auth** (no third-party
> auth provider needed).

---

## What's inside

### Storefront (the "site")

- Multilingual home page (AR · FR · EN) with **automatic RTL** for Arabic.
- Product catalog with search and price sort.
- Category pages and individual seller storefronts (`/s/<slug>`).
- Product detail pages with multilingual title & description.
- Cookie-based shopping cart, full checkout flow.

### Authentication & accounts

- Email + password (bcrypt) signup / signin, JWT session cookie (HS256).
- Three roles: **BUYER**, **SELLER**, **ADMIN**.
- Per-user account page with order history and download links.

### Algerian payments (the hard part)

Stripe / PayPal don't operate in Algeria, so we model **the four payment methods
real Algerian buyers actually use**:

| Method               | How it works in this app                                                   |
| -------------------- | -------------------------------------------------------------------------- |
| **CIB / Edahabia**   | Online card via SATIM (placeholder integration; falls back to manual).     |
| **BaridiMob**        | Buyer transfers from the BaridiMob app, uploads a screenshot as proof.     |
| **CCP transfer**     | Buyer pays at a post office (Algérie Poste), uploads the deposit slip.     |
| **Bank wire (RIB)**  | Buyer wires from their bank, uploads the confirmation.                     |

All non-card methods go through an **admin verification queue**: the buyer
uploads a proof, the admin approves or rejects, and on approval the buyer
automatically gets **signed download links** for each digital item.

### Digital delivery

- Sellers upload a private file per product.
- Files are stored **outside** `public/` and never served directly.
- After payment is verified, each buyer gets a **signed JWT download token**
  (one row per order × product) used by `/api/download/[token]`.
- Tokens are time-limited (30d) and capped at 10 downloads each.

### Seller dashboard

- Sellers create their own store (with custom slug `/s/my-store`).
- Multilingual product editor (titles + descriptions in AR/FR/EN).
- Cover image + private digital-asset upload.
- Sales feed and revenue summary.

### Admin dashboard

- Verification queue for pending payment proofs (approve / reject with note).
- Recent paid / rejected orders.
- Lists of all products and users.

### PWA

- `manifest.webmanifest` with brand colors and icons → installable on mobile.
- Brand-themed status bar, "standalone" display, Algerian flag-inspired palette.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (a working .env is committed for local dev)
cp .env.example .env

# 3. Apply schema and seed demo data
npx prisma db push
npm run db:seed

# 4. Run
npm run dev          # http://localhost:3000
# or
npm run build && npm start
```

### Demo accounts (after `db:seed`)

| Role   | Email             | Password    |
| ------ | ----------------- | ----------- |
| Admin  | admin@souk.dz     | admin1234   |
| Seller | seller@souk.dz    | seller1234  |
| Buyer  | buyer@souk.dz     | buyer1234   |

A demo store **Studio Casbah** is created with 6 sample products across
Ebooks, Courses, Templates, Design, and Software categories.

---

## Try the full flow in 60 seconds

1. Sign in as **buyer@souk.dz**.
2. Add any product to the cart and go to checkout.
3. Pick **BaridiMob**, upload any image as a fake proof, confirm.
4. Sign out, sign in as **admin@souk.dz**.
5. Open `/admin`, click **Valider** on the pending order.
6. Sign back in as the buyer → `/account` → click the **Download** button.

This is exactly how a real Algerian transaction would work, end-to-end.

---

## Architecture highlights

```
src/
├── app/                   App Router pages
│   ├── (storefront)       /, /catalog, /c/[slug], /p/[slug], /s/[slug], /cart, /checkout
│   ├── account, signin, signup
│   ├── orders/[id]/{thanks,pay}     order receipt + proof upload
│   ├── seller/            seller dashboard + product CRUD
│   ├── admin/             admin verification + lists
│   ├── api/download/[token]/  secure file delivery
│   └── actions/           Server Actions (auth, cart, checkout, seller, admin)
├── components/            SiteHeader, SiteFooter, ProductCard, ProductForm, LocaleSwitcher
└── lib/                   db, auth (JWT), i18n, money (DZD), uploads, payments,
                           cart, locale, orderFulfill, orderNumber
prisma/
├── schema.prisma          User, SellerProfile, Category, Product, Order,
│                          OrderItem, Download
└── seed.ts                Demo categories, users, products
public/                    PWA manifest, icons, sample cover SVGs
```

### Key design choices

- **Prisma schema avoids enums** because SQLite doesn't support them. Status
  fields use validated strings (e.g. `"PENDING_PAYMENT"`, `"AWAITING_REVIEW"`,
  `"PAID"`, `"REJECTED"`, `"CANCELLED"`). When migrating to Postgres, you can
  promote these to real enums in one migration.

- **Money is stored as `Int` DZD.** Algerian retail rarely uses centimes; we
  treat the smallest unit as the dinar itself. `formatDzd()` uses Intl with
  `fr-DZ` / `ar-DZ` / `en-DZ` locale tags and a fallback for runtimes without
  ICU data for those tags.

- **Server Actions everywhere** — no client-side fetch boilerplate; cart,
  checkout, auth and admin actions all run on the server with cookies.

- **Files**: covers go to `public/uploads/` and are publicly served. Digital
  deliverables go to `uploads/private/` and are only readable through
  `/api/download/[token]` with a verified JWT.

- **JWT secrets**: `AUTH_SECRET` signs both session cookies and download
  tokens. Must be **≥ 32 chars** in production.

---

## Going to production

1. Switch the Prisma datasource to PostgreSQL:

   ```prisma
   datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
   ```

   Then `npx prisma migrate dev --name init`.

2. Replace local file uploads with object storage (S3, Bunny, Backblaze).
   Edit `src/lib/uploads.ts` — keep the same return shape (`{ url, path,
   name, size }`) and the rest of the app works unchanged.

3. Real **CIB / Edahabia** payments need a SATIM merchant account:
   - Set `SATIM_MERCHANT_ID`, `SATIM_API_USERNAME`, `SATIM_API_PASSWORD` in
     `.env`.
   - Implement the redirect flow in
     `src/app/orders/[id]/pay/page.tsx` (calling
     `${SATIM_GATEWAY_URL}/register.do`) and a webhook callback that flips
     the order to `PAID` and calls `fulfillOrder()`.

4. Set a strong `AUTH_SECRET` and `NEXT_PUBLIC_SITE_URL`.

5. Deploy the Next.js app (Vercel, Railway, a self-hosted VPS in Algeria,
   etc.). The whole app is a single Node process — no separate API needed.

---

## Scripts

| Command            | Purpose                              |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Run the dev server                   |
| `npm run build`    | `prisma generate` + `next build`     |
| `npm start`        | Run the production build             |
| `npm run db:push`  | Push the Prisma schema to the DB     |
| `npm run db:seed`  | Seed demo categories & products      |
| `npm run db:reset` | Wipe and re-create the database      |
| `npx tsx scripts/e2e-test.ts` | End-to-end test (server must be running on :3000) |

---

## License

MIT — build something cool for Algeria 🇩🇿
