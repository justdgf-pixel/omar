import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartHydrator } from "@/components/CartHydrator";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Souqami — سوقمي",
  description:
    "Algeria's marketplace for digital products. Pay in DZD with CIB, Edahabia, BaridiMob or CCP.",
  manifest: "/manifest.webmanifest",
};

export const viewport = { themeColor: "#1faa5b" };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();
  const dir = localeMeta[locale as Locale].dir;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <CartHydrator />
            <Navbar locale={locale as Locale} />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
