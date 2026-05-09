# DigiSouk - Marketplace de Produits Numériques en Algérie

DigiSouk is a modern digital products marketplace built specifically for the Algerian market. It supports local payment methods (CIB, Dahabia, BaridiMob, CCP), dual language (French/Arabic with RTL), and works as both a website and a Progressive Web App (PWA) for mobile.

## Features

- **Digital Products Marketplace** — Browse, search, and purchase e-books, courses, templates, software, graphics, music, and photos
- **Algerian Payment Methods** — CIB (Carte Interbancaire), Edahabia, BaridiMob, and CCP/postal transfers
- **Bilingual (French / Arabic)** — Full French and Arabic translations with proper RTL layout support
- **PWA Support** — Install as a mobile app on Android/iOS for a native-like experience
- **Admin Dashboard** — Manage products, view orders, track revenue and customer metrics
- **Shopping Cart** — Persistent cart with Zustand state management
- **Responsive Design** — Mobile-first, works beautifully on all screen sizes
- **All 48 Wilayas** — Complete list of Algerian wilayas for user registration and checkout
- **DZD Currency** — All prices displayed in Algerian Dinars (DA / د.ج)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (with localStorage persistence)
- **Icons:** Lucide React
- **Fonts:** Inter (Latin) + Cairo (Arabic)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── products/           # Product catalog & detail pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout & success pages
│   ├── auth/               # Login & registration
│   └── admin/              # Admin dashboard, products & orders
├── components/
│   ├── layout/             # Header & Footer
│   ├── products/           # ProductCard & ProductGrid
│   └── ui/                 # Reusable UI components
├── data/                   # Sample product data
├── lib/                    # Utilities & translations
├── store/                  # Zustand stores (cart, locale)
└── types/                  # TypeScript type definitions
```

## Payment Integration

The checkout flow supports four Algerian payment methods:

| Method     | Description                        |
|------------|------------------------------------|
| CIB        | Carte Interbancaire (bank card)    |
| Edahabia   | Algeria Post's Edahabia card       |
| BaridiMob  | Algeria Post's mobile payment app  |
| CCP        | Postal account transfer            |

> Payment processing is currently simulated. To integrate real payments, connect to [SATIM](https://www.satim.dz/) (for CIB) or Algeria Post APIs.

## Language Support

Toggle between French and Arabic using the globe icon in the header. Arabic mode enables full RTL (right-to-left) layout.

## License

MIT
