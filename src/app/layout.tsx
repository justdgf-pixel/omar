import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLocale } from "@/lib/locale";
import { LOCALE_DIR, t } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? "Souk Digital DZ",
    template: `%s — ${process.env.NEXT_PUBLIC_SITE_NAME ?? "Souk Digital DZ"}`,
  },
  description:
    "Marketplace algérienne de produits numériques : ebooks, templates, formations, plugins. Paiement CIB, Edahabia, BaridiMob, CCP.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Souk Digital DZ" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a9d4f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const user = await getCurrentUser();
  const cart = await readCart();
  const cartCount = cart.reduce((acc, x) => acc + x.qty, 0);

  return (
    <html lang={locale} dir={LOCALE_DIR[locale]}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader
          locale={locale}
          user={
            user
              ? {
                  id: user.id,
                  name: user.name,
                  role: user.role as "BUYER" | "SELLER" | "ADMIN",
                  isSeller: !!user.sellerProfile,
                }
              : null
          }
          cartCount={cartCount}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} t={(k) => t(locale, k)} />
      </body>
    </html>
  );
}
