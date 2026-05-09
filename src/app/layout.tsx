import "./globals.css";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { defaultLocale, dirOf, isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Souk Digital — منتجات رقمية للجزائر",
    template: "%s · Souk Digital"
  },
  description:
    "Souk Digital — منصّة جزائرية لشراء وبيع الكتب الإلكترونية، الدورات، القوالب والبرمجيات. الدفع عبر الذهبية و CIB.",
  manifest: "/manifest.webmanifest",
  applicationName: "Souk Digital",
  appleWebApp: {
    capable: true,
    title: "Souk Digital",
    statusBarStyle: "default"
  },
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon.svg" }
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const h = headers();
  const candidate = h.get("x-locale");
  const locale = isLocale(candidate) ? candidate : defaultLocale;
  const dir = dirOf(locale);
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
