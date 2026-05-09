import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";

export default async function SellerHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (!user.sellerProfile) redirect("/sell");
  const locale = await getLocale();

  const sellerId = user.sellerProfile.id;
  const products = await prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const items = await prisma.orderItem.findMany({
    where: { product: { sellerId } },
    include: { order: true, product: true },
    orderBy: { id: "desc" },
    take: 30,
  });

  const totalRevenue = items
    .filter((i) => i.order.status === "PAID")
    .reduce((acc, i) => acc + i.priceDzd * i.qty, 0);

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-500">
            {t(locale, "nav.dashboard")}
          </p>
          <h1 className="text-2xl font-bold">{user.sellerProfile.storeName}</h1>
          <p className="text-sm text-ink-500">
            /s/{user.sellerProfile.storeSlug}
          </p>
        </div>
        <Link href="/seller/products/new" className="btn-primary">
          + Nouveau produit
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Produits" value={String(products.length)} />
        <Stat
          label="Ventes confirmées"
          value={String(items.filter((i) => i.order.status === "PAID").length)}
        />
        <Stat
          label="Revenu (payé)"
          value={formatDzd(totalRevenue, locale)}
        />
      </div>

      <h2 className="mt-10 text-lg font-bold">Mes produits</h2>
      {products.length === 0 ? (
        <div className="card mt-3 p-8 text-center text-ink-500">
          {t(locale, "common.empty")} —{" "}
          <Link href="/seller/products/new" className="text-brand-700 hover:underline">
            créez votre premier produit
          </Link>
        </div>
      ) : (
        <ul className="mt-3 grid gap-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="card flex items-center gap-4 p-3"
            >
              {p.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt="" className="h-16 w-24 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-semibold">
                  {pickI18nField(
                    p as unknown as Record<string, unknown>,
                    "title",
                    locale,
                  )}
                </p>
                <p className="text-xs text-ink-500">
                  {p.status} · {formatDzd(p.priceDzd, locale)} ·{" "}
                  {pickI18nField(
                    p.category as unknown as Record<string, unknown>,
                    "name",
                    locale,
                  )}
                </p>
              </div>
              <Link href={`/seller/products/${p.id}`} className="btn-outline">
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-bold">Ventes récentes</h2>
      {items.length === 0 ? (
        <div className="card mt-3 p-8 text-center text-ink-500">
          {t(locale, "common.empty")}
        </div>
      ) : (
        <ul className="mt-3 grid gap-2 text-sm">
          {items.map((i) => (
            <li
              key={i.id}
              className="card flex flex-wrap items-center justify-between gap-2 p-3"
            >
              <span>
                {i.titleSnapshot} × {i.qty}
              </span>
              <span className="text-ink-500">{i.order.number}</span>
              <span
                className={
                  i.order.status === "PAID"
                    ? "badge-ok"
                    : i.order.status === "AWAITING_REVIEW"
                      ? "badge-warn"
                      : "badge"
                }
              >
                {i.order.status}
              </span>
              <span className="font-semibold">
                {formatDzd(i.priceDzd * i.qty, locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink-900">{value}</p>
    </div>
  );
}
