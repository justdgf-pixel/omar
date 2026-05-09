# DigiDZ - Digital Marketplace for Algeria 🇩🇿

A full-stack digital products marketplace built specifically for the Algerian market. Buy and sell e-books, courses, templates, software, and more using local payment methods.

## Features

- **Product Catalog** - Browse digital products by category with search and filters
- **Seller Dashboard** - Upload products, manage listings, track sales and revenue
- **Buyer Dashboard** - View orders, download purchased products
- **Shopping Cart** - Add/remove products with persistent cart state
- **Algeria Payment Methods** - CCP, BaridiMob, and Edahabia card support
- **All 58 Wilayas** - Complete Algerian wilaya coverage for user profiles
- **PWA Support** - Install as a mobile app on any device
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **DZD Currency** - All prices in Algerian Dinar

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### Demo Accounts

| Role   | Email              | Password    |
|--------|--------------------|-------------|
| Seller | karim@digidz.com   | password123 |
| Seller | amina@digidz.com   | password123 |
| Seller | yacine@digidz.com  | password123 |
| Buyer  | buyer@digidz.com   | password123 |

## Project Structure

```
src/
├── app/
│   ├── api/            # API routes (auth, products, orders, categories)
│   ├── auth/           # Sign in / Sign up pages
│   ├── cart/           # Shopping cart page
│   ├── checkout/       # Checkout with payment selection
│   ├── dashboard/
│   │   ├── buyer/      # Buyer dashboard (orders, downloads)
│   │   └── seller/     # Seller dashboard (products, sales, orders)
│   ├── products/       # Product listing and detail pages
│   ├── layout.tsx      # Root layout with nav and footer
│   └── page.tsx        # Landing page
├── components/
│   ├── layout/         # Navbar, Footer
│   └── ui/             # ProductCard, HeroSection, CategoryGrid, etc.
├── lib/                # Prisma client, utils, auth helpers
└── store/              # Zustand cart store
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Sample data seeder
```

## Payment Methods

DigiDZ supports Algeria-specific payment methods:

- **CCP (Compte Postal)** - Algeria Post checking account transfers
- **BaridiMob** - Mobile payment via Algeria Post
- **Edahabia Card** - Algeria Post's electronic payment card
