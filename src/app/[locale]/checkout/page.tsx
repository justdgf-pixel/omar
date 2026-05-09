"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatDzd } from "@/lib/money";
import { tFor, type Locale, isLocale } from "@/lib/i18n";

const methods = [
  { id: "CHARGILY_EDAHABIA", labelKey: "checkout.method.edahabia", emoji: "💳" },
  { id: "CHARGILY_CIB", labelKey: "checkout.method.cib", emoji: "💳" },
  { id: "BARIDIMOB", labelKey: "checkout.method.baridimob", emoji: "📱" },
  { id: "BANK_TRANSFER", labelKey: "checkout.method.bank", emoji: "🏦" }
] as const;

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params?.locale) ? (params.locale as Locale) : "ar";
  const t = tFor(locale);
  const router = useRouter();
  const { items, totalDzd, clear } = useCart();
  const { data: session, status } = useSession();
  const [method, setMethod] =
    useState<(typeof methods)[number]["id"]>("CHARGILY_EDAHABIA");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return <div className="container-page py-10">{t("common.loading")}</div>;
  }

  if (!session?.user) {
    return (
      <div className="container-page py-10">
        <div className="card mx-auto max-w-md p-8 text-center">
          <p className="text-slate-700">
            {locale === "ar"
              ? "يلزم تسجيل الدخول لإتمام الشراء."
              : locale === "fr"
                ? "Connectez-vous pour finaliser l’achat."
                : "Please sign in to complete checkout."}
          </p>
          <Link
            href={`/${locale}/auth/login?next=/${locale}/checkout`}
            className="btn-primary mt-4"
          >
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-10">
        <div className="card p-10 text-center text-slate-600">{t("cart.empty")}</div>
      </div>
    );
  }

  async function pay() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          paymentMethod: method,
          items: items.map((i) => ({ productId: i.id }))
        })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        checkoutUrl: string;
        orderId: string;
      };
      clear();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        {t("checkout.title")}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">{t("checkout.method")}</h2>
          <div className="grid gap-2">
            {methods.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  method === m.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="text-brand-600"
                />
                <span className="text-xl">{m.emoji}</span>
                <span className="font-medium">{t(m.labelKey)}</span>
              </label>
            ))}
          </div>
          {error ? (
            <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          {(method === "BANK_TRANSFER" || method === "BARIDIMOB") && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {locale === "ar"
                ? "بعد إتمام الطلب ستظهر تعليمات الدفع. يتم تأكيد الطلب يدويًا بعد استلام الدفع."
                : locale === "fr"
                  ? "Après commande, vous verrez les instructions de paiement. La commande est confirmée manuellement après réception."
                  : "After ordering, you’ll see payment instructions. Orders are confirmed manually after payment is received."}
            </p>
          )}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-3 font-semibold">{t("cart.title")}</h2>
          <ul className="divide-y divide-slate-100">
            {items.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="line-clamp-1">{i.title}</span>
                <span className="font-medium">
                  {formatDzd(i.priceDzd, locale)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>{t("cart.total")}</span>
            <span className="text-lg font-bold text-brand-700">
              {formatDzd(totalDzd, locale)}
            </span>
          </div>
          <button
            onClick={pay}
            disabled={submitting}
            className="btn-primary mt-4 w-full"
          >
            {submitting ? t("common.loading") : t("checkout.pay")}
          </button>
        </div>
      </div>
    </div>
  );
}
