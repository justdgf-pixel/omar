"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { use } from "react";
import { useCart } from "@/store/cart";
import { formatDzd } from "@/lib/money";
import type { Locale } from "@/i18n/config";

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("cart");
  const { items, remove, totalCentimes } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">{t("title")}</h1>
      {items.length === 0 ? (
        <div className="card p-10 text-center text-stone-500">{t("empty")}</div>
      ) : (
        <>
          <div className="card divide-y divide-stone-100">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 flex-none overflow-hidden rounded-lg bg-brand-50">
                  {i.coverUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={i.coverUrl} alt={i.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/${locale}/p/${i.slug}`} className="font-medium text-stone-900 hover:underline">
                    {i.title}
                  </Link>
                  <div className="text-sm text-brand-700">{formatDzd(i.priceCentimes, locale as Locale)}</div>
                </div>
                <button
                  onClick={() => remove(i.productId)}
                  className="text-sm text-stone-500 hover:text-accent-500"
                >
                  {t("remove")}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">
              {t("subtotal")}: {formatDzd(totalCentimes(), locale as Locale)}
            </div>
            <Link href={`/${locale}/checkout`} className="btn-primary">
              {t("checkout")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
