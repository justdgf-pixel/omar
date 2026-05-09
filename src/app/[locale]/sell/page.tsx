import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SellLanding({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user && session.user.role !== "CUSTOMER") {
    redirect(`/${locale}/seller`);
  }

  const fee = process.env.PLATFORM_FEE_PERCENT ?? "10";
  const t = {
    ar: {
      title: "بِع منتجاتك الرقمية على سوقمي",
      sub: `ارفع منتجك وحدّد السعر بالدينار، ونحن نتكفّل بالدفع والتسليم. عمولتنا فقط ${fee}٪.`,
      cta: "ابدأ البيع",
      step1Title: "أنشئ حساب بائع",
      step1: "تحتاج فقط بريدًا إلكترونيًا ورقم هاتف جزائري.",
      step2Title: "ارفع منتجك",
      step2: "PDF، ZIP، صور، صوت، فيديو... أيّ ملف رقمي.",
      step3Title: "استلم أرباحك",
      step3: "تحويل إلى حسابك CCP أو البنكي خلال 7 أيام عمل.",
    },
    fr: {
      title: "Vendez vos produits numériques sur Souqami",
      sub: `Mettez en ligne, fixez votre prix en DA, on s'occupe du paiement et de la livraison. Commission de seulement ${fee}%.`,
      cta: "Commencer à vendre",
      step1Title: "Créez un compte vendeur",
      step1: "Un e-mail et un numéro algérien suffisent.",
      step2Title: "Uploadez votre produit",
      step2: "PDF, ZIP, images, audio, vidéo... tout fichier numérique.",
      step3Title: "Recevez vos paiements",
      step3: "Virement vers votre CCP ou compte bancaire sous 7 jours ouvrés.",
    },
    en: {
      title: "Sell your digital products on Souqami",
      sub: `Upload, set your price in DZD, we handle payment and delivery. Commission only ${fee}%.`,
      cta: "Start selling",
      step1Title: "Create a seller account",
      step1: "Just an email and an Algerian phone number.",
      step2Title: "Upload your product",
      step2: "PDF, ZIP, images, audio, video... any digital file.",
      step3Title: "Get paid",
      step3: "CCP or bank transfer within 7 business days.",
    },
  }[locale as "ar" | "fr" | "en"]!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>
        <p className="mt-3 text-stone-600">{t.sub}</p>
        <Link
          href={session?.user ? `/${locale}/seller/new` : `/${locale}/auth/register`}
          className="btn-primary mt-6 inline-flex"
        >
          {t.cta}
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { n: "1", title: t.step1Title, body: t.step1 },
          { n: "2", title: t.step2Title, body: t.step2 },
          { n: "3", title: t.step3Title, body: t.step3 },
        ].map((s) => (
          <div key={s.n} className="card p-6">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
              {s.n}
            </div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
