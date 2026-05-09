import Link from "next/link";
import { redirect } from "next/navigation";
import { readCart } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import {
  getPaymentInstructions,
  isSatimConfigured,
  methodLabel,
} from "@/lib/payments";
import { placeOrderAction } from "@/app/actions/checkout";

export default async function CheckoutPage() {
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect("/signin?error=Connectez-vous%20pour%20continuer");
  const items = await readCart();
  if (items.length === 0) redirect("/cart");

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const rows = items
    .map((i) => ({ qty: i.qty, p: products.find((x) => x.id === i.productId) }))
    .filter((r) => r.p);
  const total = rows.reduce((acc, r) => acc + r.p!.priceDzd * r.qty, 0);
  const inst = getPaymentInstructions();

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">{t(locale, "checkout.title")}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          action={placeOrderAction}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <section className="card p-5">
            <h2 className="text-base font-semibold">
              {t(locale, "checkout.method")}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MethodOption
                name="method"
                value="CIB_EDAHABIA"
                title={methodLabel("CIB_EDAHABIA", locale)}
                hint={
                  isSatimConfigured()
                    ? "Paiement sécurisé en ligne via SATIM."
                    : "Bientôt disponible — utilisez BaridiMob, CCP ou RIB."
                }
                disabled={!isSatimConfigured()}
                emoji="💳"
              />
              <MethodOption
                name="method"
                value="BARIDIMOB"
                title={methodLabel("BARIDIMOB", locale)}
                hint="Transfert depuis l'app BaridiMob — joignez la capture."
                emoji="📱"
                defaultChecked
              />
              <MethodOption
                name="method"
                value="CCP_TRANSFER"
                title={methodLabel("CCP_TRANSFER", locale)}
                hint="Versement au bureau de poste — joignez le reçu."
                emoji="🏤"
              />
              <MethodOption
                name="method"
                value="RIB_BANK_TRANSFER"
                title={methodLabel("RIB_BANK_TRANSFER", locale)}
                hint="Virement bancaire — joignez l'avis d'opéré."
                emoji="🏦"
              />
            </div>

            <div className="mt-5 grid gap-3 rounded-xl bg-ink-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-semibold text-ink-900">CCP</p>
                <p className="text-ink-700">{inst.ccpAccount}</p>
                <p className="text-xs text-ink-500">{inst.ccpHolder}</p>
              </div>
              <div>
                <p className="font-semibold text-ink-900">BaridiMob (RIP)</p>
                <p className="text-ink-700">{inst.baridimobRip}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-semibold text-ink-900">RIB</p>
                <p className="text-ink-700">
                  {inst.ribBank} · {inst.ribAccount}
                </p>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-base font-semibold">
              {t(locale, "checkout.proof")}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {t(locale, "checkout.proof.help")}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="proof" className="label">
                  {t(locale, "common.upload")}
                </label>
                <input
                  id="proof"
                  type="file"
                  name="proof"
                  accept="image/*,application/pdf"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="ref" className="label">
                  {t(locale, "checkout.ref")}
                </label>
                <input id="ref" name="ref" className="input" placeholder="ex: TR-23987" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="note" className="label">
                  {t(locale, "checkout.note")}
                </label>
                <textarea id="note" name="note" rows={2} className="input" />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              {t(locale, "checkout.terms")}
            </p>
          </section>

          <button className="btn-primary w-full sm:w-auto">
            {t(locale, "checkout.confirm")}
          </button>
        </form>

        <aside className="card sticky top-20 h-fit p-5">
          <h3 className="text-base font-semibold">{t(locale, "common.subtotal")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {rows.map(({ p, qty }) => (
              <li key={p!.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {pickI18nField(
                    p as unknown as Record<string, unknown>,
                    "title",
                    locale,
                  )}{" "}
                  × {qty}
                </span>
                <span>{formatDzd(p!.priceDzd * qty, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 text-lg font-bold">
            <span>{t(locale, "common.total")}</span>
            <span className="text-brand-700">{formatDzd(total, locale)}</span>
          </div>
          <Link href="/cart" className="btn-ghost mt-3 w-full">
            ← {t(locale, "nav.cart")}
          </Link>
        </aside>
      </div>
    </div>
  );
}

function MethodOption({
  name,
  value,
  title,
  hint,
  emoji,
  disabled,
  defaultChecked,
}: {
  name: string;
  value: string;
  title: string;
  hint: string;
  emoji: string;
  disabled?: boolean;
  defaultChecked?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${disabled ? "opacity-50" : "hover:border-brand-300"} border-ink-200 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked && !disabled}
        disabled={disabled}
        required={!disabled && defaultChecked}
        className="mt-1"
      />
      <div>
        <p className="font-medium">
          <span className="me-2" aria-hidden>{emoji}</span>
          {title}
        </p>
        <p className="text-xs text-ink-500">{hint}</p>
      </div>
    </label>
  );
}
