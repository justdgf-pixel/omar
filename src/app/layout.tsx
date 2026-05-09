import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StoreHydration from "@/components/layout/StoreHydration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "DigiSouk - Marketplace de Produits Numériques en Algérie",
  description:
    "Achetez et vendez des produits numériques en Algérie : e-books, cours en ligne, templates, logiciels. Paiement par CIB, Dahabia et BaridiMob.",
  keywords: [
    "produits numériques",
    "algérie",
    "marketplace",
    "e-books",
    "cours en ligne",
    "templates",
    "logiciels",
    "CIB",
    "Dahabia",
    "BaridiMob",
  ],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <StoreHydration />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
