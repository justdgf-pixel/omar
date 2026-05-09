import Link from "next/link";
import { tFor, type Locale, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface Props {
  params: { locale: string };
  searchParams: { orderId?: string };
}

export default function SuccessPage({ params, searchParams }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);

  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-700">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {locale === "ar"
            ? "تمّ الدفع بنجاح"
            : locale === "fr"
              ? "Paiement réussi"
              : "Payment successful"}
        </h1>
        <p className="mt-2 text-slate-600">
          {locale === "ar"
            ? "ستجد روابط التحميل في لوحة التحكم."
            : locale === "fr"
              ? "Vos liens de téléchargement sont disponibles dans votre tableau de bord."
              : "Your downloads are now available in your dashboard."}
        </p>
        {searchParams.orderId ? (
          <div className="mt-2 text-xs text-slate-400">
            ID: {searchParams.orderId}
          </div>
        ) : null}
        <Link href={`/${locale}/dashboard`} className="btn-primary mt-6 w-full">
          {t("nav.dashboard")}
        </Link>
      </div>
    </div>
  );
}
