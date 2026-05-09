import Link from "next/link";
import { tFor, type Locale, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface Props {
  params: { locale: string };
  searchParams: { orderId?: string };
}

// In dev/test mode (no Chargily key), checkout redirects here so the user can
// simulate a successful or failed payment end-to-end without external accounts.
export default function MockPaymentPage({ params, searchParams }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  const orderId = searchParams.orderId ?? "";

  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold">
          {locale === "ar"
            ? "وضع تجريبي للدفع"
            : locale === "fr"
              ? "Paiement de test"
              : "Test payment"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {locale === "ar"
            ? "لا يوجد مفتاح Chargily Pay. يمكنك محاكاة العملية:"
            : locale === "fr"
              ? "Aucune clé Chargily Pay configurée. Simulez le résultat :"
              : "No Chargily Pay key configured. Simulate the result:"}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <form
            method="POST"
            action={`/api/payments/mock?orderId=${encodeURIComponent(orderId)}&result=paid&locale=${locale}`}
          >
            <button className="btn-primary w-full">
              {locale === "ar" ? "نجاح" : locale === "fr" ? "Réussir" : "Succeed"}
            </button>
          </form>
          <form
            method="POST"
            action={`/api/payments/mock?orderId=${encodeURIComponent(orderId)}&result=failed&locale=${locale}`}
          >
            <button className="btn-secondary w-full">
              {locale === "ar" ? "فشل" : locale === "fr" ? "Échouer" : "Fail"}
            </button>
          </form>
        </div>
        <Link
          href={`/${locale}/dashboard`}
          className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-700"
        >
          {t("nav.dashboard")}
        </Link>
      </div>
    </div>
  );
}
