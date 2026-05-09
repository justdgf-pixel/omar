import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import { signoutAction } from "@/app/actions/auth";

const STATUS_BADGE: Record<string, string> = {
  PENDING_PAYMENT: "badge-warn",
  AWAITING_REVIEW: "badge-warn",
  PAID: "badge-ok",
  REJECTED: "badge-fail",
  CANCELLED: "badge-fail",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const locale = await getLocale();

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      downloads: { include: { product: true } },
    },
  });

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t(locale, "nav.account")}</h1>
          <p className="text-sm text-ink-500">
            {user.name} · {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          {!user.sellerProfile && (
            <Link href="/sell" className="btn-outline">
              {t(locale, "nav.sell")}
            </Link>
          )}
          <form action={signoutAction}>
            <button className="btn-ghost">{t(locale, "nav.signout")}</button>
          </form>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold">Mes commandes</h2>
      {orders.length === 0 ? (
        <div className="card mt-3 p-8 text-center text-ink-500">
          {t(locale, "common.empty")}
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{o.number}</p>
                  <p className="text-xs text-ink-500">
                    {new Date(o.createdAt).toLocaleString()} · {o.method}
                  </p>
                </div>
                <span className={STATUS_BADGE[o.status] ?? "badge"}>
                  {o.status}
                </span>
                <span className="font-bold">{formatDzd(o.totalDzd, locale)}</span>
              </div>

              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>
                      {pickI18nField(
                        it.product as unknown as Record<string, unknown>,
                        "title",
                        locale,
                      )}{" "}
                      × {it.qty}
                    </span>
                    <span>{formatDzd(it.priceDzd * it.qty, locale)}</span>
                  </li>
                ))}
              </ul>

              {o.status === "PAID" && o.downloads.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.downloads.map((d) => (
                    <a
                      key={d.id}
                      href={`/api/download/${d.token}`}
                      className="btn-primary"
                    >
                      ⬇ {pickI18nField(
                        d.product as unknown as Record<string, unknown>,
                        "title",
                        locale,
                      )}
                    </a>
                  ))}
                </div>
              )}

              {o.status === "AWAITING_REVIEW" && (
                <p className="mt-3 text-xs text-amber-700">
                  Votre paiement est en cours de vérification (généralement &lt; 24h).
                </p>
              )}
              {o.status === "PENDING_PAYMENT" && (
                <Link
                  href={`/orders/${o.id}/pay`}
                  className="btn-outline mt-3 inline-flex"
                >
                  {t(locale, "checkout.proof")}
                </Link>
              )}
              {o.adminNote && (
                <p className="mt-2 text-sm text-ink-600">📝 {o.adminNote}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
