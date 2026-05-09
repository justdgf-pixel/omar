import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { isLocale, tFor, type Locale } from "@/lib/i18n";

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header
          locale={locale}
          messages={{
            siteName: t("site.name"),
            home: t("nav.home"),
            catalog: t("nav.catalog"),
            sell: t("nav.sell"),
            dashboard: t("nav.dashboard"),
            cart: t("nav.cart"),
            login: t("nav.login"),
            register: t("nav.register"),
            logout: t("nav.logout")
          }}
        />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} t={t} />
      </div>
    </Providers>
  );
}

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "fr" }, { locale: "en" }];
}
