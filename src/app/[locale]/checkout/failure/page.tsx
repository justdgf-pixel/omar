import Link from "next/link";
import { tFor, type Locale, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { XCircle } from "lucide-react";

interface Props {
  params: { locale: string };
}

export default function FailurePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-700">
          <XCircle size={28} />
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {locale === "ar"
            ? "فشل الدفع"
            : locale === "fr"
              ? "Échec du paiement"
              : "Payment failed"}
        </h1>
        <p className="mt-2 text-slate-600">
          {locale === "ar"
            ? "لم تكتمل عملية الدفع. حاول مرة أخرى."
            : locale === "fr"
              ? "Le paiement n’a pas abouti. Veuillez réessayer."
              : "The payment did not complete. Please try again."}
        </p>
        <Link href={`/${locale}/cart`} className="btn-primary mt-6 w-full">
          {t("cart.title")}
        </Link>
      </div>
    </div>
  );
}
