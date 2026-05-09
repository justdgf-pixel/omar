# DigiStore DZ - Digital Products Marketplace for Algeria

A full-stack e-commerce platform for selling digital products in Algeria, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### Storefront
- Beautiful, responsive homepage with hero section, featured products, and categories
- Product catalog with search and category filtering
- Product detail pages with full descriptions in French and Arabic
- Shopping cart with real-time updates
- Checkout flow with Algeria-specific payment methods

### Algeria-Specific
- **Currency**: All prices in Algerian Dinar (DZD)
- **Payment Methods**: CCP, BaridiMob, Carte EDAHABIA, Bank Transfer
- **All 58 Wilayas** supported for customer location
- **Bilingual**: French and Arabic support
- **WhatsApp integration** for payment proof and customer support

### Admin Dashboard
- Dashboard with revenue, orders, users stats
- Product management (CRUD, publish/unpublish, featured toggle)
- Order management with status workflow (pending → confirmed → completed)
- Automatic download link generation when orders are completed

### Technical
- **PWA**: Installable on mobile devices as a native-like app
- **Authentication**: JWT-based auth with secure httpOnly cookies
- **Database**: SQLite with Prisma ORM (easily switchable to PostgreSQL)
- **Digital Delivery**: Secure, time-limited, count-limited download tokens

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite + Prisma
- **Auth**: JWT + bcrypt
- **State Management**: Zustand

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Seed sample data
# Start the server first, then POST to /api/seed
npm run dev
# In another terminal: curl -X POST http://localhost:3000/api/seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Admin Credentials

After seeding, login with:
- **Email**: admin@digistore.dz
- **Password**: admin123

## Project Structure

```
src/
├── app/
│   ├── (storefront)/      # Public-facing store pages
│   │   ├── page.tsx        # Homepage
│   │   ├── products/       # Product catalog & detail
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   └── orders/         # Customer orders
│   ├── admin/              # Admin dashboard
│   │   ├── products/       # Manage products
│   │   └── orders/         # Manage orders
│   ├── auth/               # Login & registration
│   └── api/                # API routes
│       ├── auth/           # Authentication endpoints
│       ├── products/       # Product CRUD
│       ├── orders/         # Order management
│       ├── categories/     # Category management
│       ├── admin/          # Admin statistics
│       └── download/       # Secure file downloads
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Navbar, Footer
│   └── storefront/         # Store-specific components
├── lib/
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Authentication utilities
│   ├── store.ts            # Zustand stores (cart, auth)
│   └── utils.ts            # Helpers, constants
└── generated/prisma/       # Prisma generated client
```

## Payment Flow

1. Customer adds products to cart
2. At checkout, selects a payment method (CCP, BaridiMob, etc.)
3. Order is created with "pending" status
4. Customer sends payment proof via WhatsApp
5. Admin confirms payment → status becomes "confirmed"
6. Admin completes order → download links are generated
7. Customer receives secure, time-limited download links

## License

MIT
