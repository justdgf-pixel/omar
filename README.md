# DigiStore DZ - Marketplace de Produits Numériques en Algérie

A full-stack digital products marketplace built for the Algerian market, supporting local payment methods (CCP, BaridiMob, Dahabia) and priced in Algerian Dinar (DZD).

## Features

- **Product Catalog** - Browse, search, and filter digital products by category
- **Algerian Payment Methods** - CCP, BaridiMob, and Dahabia card support
- **Seller Dashboard** - Upload and manage digital products, track sales
- **Admin Panel** - Manage orders, users, and site settings
- **Shopping Cart** - Persistent cart with Zustand state management
- **Authentication** - JWT-based auth with role-based access (buyer/seller/admin)
- **PWA Support** - Installable as a mobile app with offline caching
- **Bilingual** - French and Arabic support for product content
- **Responsive** - Mobile-first design that works on all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT with httpOnly cookies
- **State**: Zustand (cart persistence)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma migrate dev
```

### Seed Demo Data

Start the dev server and then run:

```bash
curl -X POST http://localhost:3000/api/seed
```

This creates:
- Admin account: `admin@digistore.dz` / `admin123`
- Seller account: `seller@digistore.dz` / `seller123`
- 6 sample products across 6 categories

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (shop)/          # Products, Cart, Checkout
│   ├── admin/           # Admin panel
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── products/    # Product CRUD
│   │   ├── orders/      # Order management
│   │   ├── categories/  # Categories
│   │   ├── admin/       # Admin endpoints
│   │   ├── upload/      # File uploads
│   │   └── seed/        # Database seeding
│   └── dashboard/       # Seller dashboard
├── components/          # Reusable components
├── lib/                 # Utilities and Prisma client
├── store/               # Zustand stores
└── generated/           # Prisma generated client
```

## Payment Flow

1. Buyer adds products to cart
2. At checkout, buyer selects payment method (CCP/BaridiMob/Dahabia)
3. Payment instructions with account details are displayed
4. Buyer completes payment externally and enters the transaction reference
5. Admin verifies payment and confirms the order
6. Buyer gets access to download the digital products

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `NEXTAUTH_SECRET` | JWT signing secret | (required) |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
