"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatDzd } from "@/lib/money";
import type { Locale } from "@/i18n/config";

type Method = "CIB" | "EDAHABIA" | "BARIDIMOB" | "CCP_TRANSFER";

const bankInfo = {
  beneficiary: process.env.NEXT_PUBLIC_BANK_BENEFICIARY_NAME ?? "Souqami SARL",
  ccp: process.env.NEXT_PUBLIC_BANK_CCP_ACCOUNT ?? "0000000000 00",
  rib: process.env.NEXT_PUBLIC_BANK_RIB ?? "—",
  baridimob: process.env.NEXT_PUBLIC_BANK_BARIDIMOB_PHONE ?? "—",
};

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, totalCentimes, clear } = useCart();
  const [method, setMethod] = useState<Method>("CCP_TRANSFER");
  const [proofNote, setProofNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-stone-500">{tCart("empty")}</p>
        <Link href={`/${locale}/browse`} className="btn-primary mt-4 inline-flex">
          {locale === "ar" ? "تصفّح المنتجات" : locale === "fr" ? "Parcourir" : "Browse"}
        </Link>
      </div>
    );
  }

  if (status === "loading") return <div className="px-4 py-12 text-center">…</div>;
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-stone-500">
          {locale === "ar"
            ? "يجب تسجيل الدخول لإتمام الشراء."
            : locale === "fr"
              ? "Veuillez vous connecter pour finaliser l'achat."
              : "Please sign in to complete your purchase."}
        </p>
        <Link
          href={`/${locale}/auth/login`}
          className="btn-primary mt-4 inline-flex"
        >
          {locale === "ar" ? "تسجيل الدخول" : locale === "fr" ? "Connexion" : "Sign in"}
        </Link>
      </div>
    );
  }

  async function placeOrder() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds: items.map((i) => i.productId),
        paymentMethod: method,
        proofNote: proofNote || undefined,
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Failed to place order. Please try again.");
      return;
    }
    const data = await res.json();
    clear();
    router.push(`/${locale}/orders/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">{t("title")}</h1>

      <div className="card mb-6 divide-y divide-stone-100">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center justify-between p-4">
            <span className="font-medium">{i.title}</span>
            <span className="text-brand-700">{formatDzd(i.priceCentimes, locale as Locale)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 font-semibold">
          <span>{tCart("subtotal")}</span>
          <span>{formatDzd(totalCentimes(), locale as Locale)}</span>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold">{t("method")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              { id: "CIB", icon: "💳", label: t("cib") },
              { id: "EDAHABIA", icon: "🟡", label: t("edahabia") },
              { id: "BARIDIMOB", icon: "📱", label: t("baridimob") },
              { id: "CCP_TRANSFER", icon: "🏦", label: t("ccp") },
            ] as { id: Method; icon: string; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-start transition ${
                method === m.id
                  ? "border-brand-500 bg-brand-50"
                  : "border-stone-200 hover:bg-stone-50"
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-stone-50 p-4 text-sm text-stone-700">
          <h3 className="mb-2 font-semibold">{t("instructions")}</h3>
          {method === "CIB" || method === "EDAHABIA" ? (
            <p>{t("satimNote")}</p>
          ) : method === "BARIDIMOB" ? (
            <div className="space-y-1">
              <p>{t("baridimobInstructions")}</p>
              <p>
                <strong>{t("phone")}:</strong> {bankInfo.baridimob}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p>{t("ccpInstructions")}</p>
              <p>
                <strong>{t("beneficiary")}:</strong> {bankInfo.beneficiary}
              </p>
              <p>
                <strong>{t("ccp")}:</strong> {bankInfo.ccp}
              </p>
              <p>
                <strong>{t("rib")}:</strong> {bankInfo.rib}
              </p>
            </div>
          )}
        </div>

        {(method === "BARIDIMOB" || method === "CCP_TRANSFER") && (
          <div className="mt-4">
            <label className="label">
              {locale === "ar"
                ? "ملاحظة الدفع (رقم العملية، إلخ)"
                : locale === "fr"
                  ? "Note (numéro de transaction, etc.)"
                  : "Payment note (transaction id, etc.)"}
            </label>
            <textarea
              className="input min-h-[80px]"
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              maxLength={500}
            />
          </div>
        )}

        {error && <div className="mt-4 text-sm text-accent-500">{error}</div>}

        <button onClick={placeOrder} disabled={pending} className="btn-primary mt-6 w-full">
          {pending ? "…" : t("submitOrder")}
        </button>
      </div>
    </div>
  );
}
