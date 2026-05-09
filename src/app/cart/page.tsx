import Link from "next/link";
import { readCart } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import { removeFromCartAction, updateQtyAction } from "@/app/actions/cart";

export default async function CartPage() {
  const locale = await getLocale();
  const items = await readCart();
  const products =
    items.length === 0
      ? []
      : await prisma.product.findMany({
          where: { id: { in: items.map((i) => i.productId) } },
        });
  const rows = items
    .map((i) => ({ qty: i.qty, p: products.find((x) => x.id === i.productId) }))
    .filter((r) => r.p);
  const total = rows.reduce((acc, r) => acc + (r.p!.priceDzd * r.qty), 0);

  if (rows.length === 0) {
    return (
      <div className="container-page py-12">
        <div className="card mx-auto max-w-md p-8 text-center">
          <div className="mb-3 text-4xl">🛒</div>
          <h1 className="text-xl font-bold">{t(locale, "common.empty")}</h1>
          <p className="mt-2 text-sm text-ink-500">
            {t(locale, "home.hero.subtitle")}
          </p>
          <Link href="/catalog" className="btn-primary mt-5">
            {t(locale, "home.hero.cta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">{t(locale, "nav.cart")}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {rows.map(({ p, qty }) => (
            <li
              key={p!.id}
              className="card flex items-center gap-4 p-3"
            >
              {p!.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p!.coverImage}
                  alt=""
                  className="h-20 w-28 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">
                  {pickI18nField(
                    p as unknown as Record<string, unknown>,
                    "title",
                    locale,
                  )}
                </p>
                <p className="text-sm text-ink-500">
                  {formatDzd(p!.priceDzd, locale)}
                </p>
                <form action={updateQtyAction} className="mt-2 flex items-center gap-2">
                  <input type="hidden" name="productId" value={p!.id} />
                  <label className="text-xs text-ink-500">
                    {t(locale, "common.qty")}
                  </label>
                  <input
                    type="number"
                    name="qty"
                    min={1}
                    max={99}
                    defaultValue={qty}
                    className="input w-20 px-2 py-1"
                  />
                  <button className="btn-ghost text-xs">
                    {t(locale, "common.save")}
                  </button>
                </form>
              </div>
              <div className="text-end">
                <p className="font-bold">
                  {formatDzd(p!.priceDzd * qty, locale)}
                </p>
                <form action={removeFromCartAction}>
                  <input type="hidden" name="productId" value={p!.id} />
                  <button className="text-xs text-rose-600 hover:underline">
                    {t(locale, "common.remove")}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card sticky top-20 h-fit p-5">
          <h3 className="text-base font-semibold">{t(locale, "common.subtotal")}</h3>
          <div className="mt-3 flex items-center justify-between text-lg font-bold">
            <span>{t(locale, "common.total")}</span>
            <span className="text-brand-700">{formatDzd(total, locale)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            {t(locale, "common.continue")} →
          </Link>
        </aside>
      </div>
    </div>
  );
}
