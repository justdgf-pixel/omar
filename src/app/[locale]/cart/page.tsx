"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatDzd } from "@/lib/money";
import { tFor, type Locale, isLocale } from "@/lib/i18n";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params?.locale) ? (params.locale as Locale) : "ar";
  const t = tFor(locale);
  const { items, totalDzd, remove } = useCart();

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t("cart.title")}</h1>
      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-600">{t("cart.empty")}</p>
          <Link href={`/${locale}/catalog`} className="btn-primary mt-4">
            {t("nav.catalog")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="card divide-y divide-slate-100">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-sand-100">
                  {i.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.cover} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${locale}/products/${i.slug}`}
                    className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                  >
                    {i.title}
                  </Link>
                  <div className="text-sm text-slate-500">
                    {formatDzd(i.priceDzd, locale)}
                  </div>
                </div>
                <button
                  onClick={() => remove(i.id)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                  aria-label={t("cart.remove")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="card h-fit p-5">
            <div className="flex items-center justify-between text-base">
              <span className="text-slate-600">{t("cart.total")}</span>
              <span className="text-xl font-bold text-brand-700">
                {formatDzd(totalDzd, locale)}
              </span>
            </div>
            <Link href={`/${locale}/checkout`} className="btn-primary mt-4 w-full">
              {t("cart.checkout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
