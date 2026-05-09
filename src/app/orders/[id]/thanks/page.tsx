import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";

export default async function OrderThanksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const locale = await getLocale();
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      downloads: { include: { product: true } },
    },
  });
  if (!order || order.buyerId !== user.id) notFound();

  return (
    <div className="container-page py-12">
      <div className="card mx-auto max-w-2xl p-6 sm:p-8">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-3xl">
            ✅
          </div>
          <h1 className="mt-4 text-2xl font-bold">Commande {order.number}</h1>
          {order.status === "AWAITING_REVIEW" && (
            <p className="mt-2 text-sm text-amber-700">
              Votre paiement est en attente de vérification (généralement &lt; 24h).
            </p>
          )}
          {order.status === "PAID" && (
            <p className="mt-2 text-sm text-emerald-700">
              Paiement confirmé — vous pouvez télécharger vos produits.
            </p>
          )}
          {order.status === "PENDING_PAYMENT" && (
            <p className="mt-2 text-sm text-ink-600">
              Pour finaliser, effectuez le paiement et envoyez-nous la preuve.
            </p>
          )}
        </div>

        <ul className="mt-6 space-y-2 text-sm">
          {order.items.map((it) => (
            <li
              key={it.id}
              className="flex justify-between border-b border-ink-100 pb-2"
            >
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
        <div className="mt-3 flex justify-between text-base font-bold">
          <span>{t(locale, "common.total")}</span>
          <span className="text-brand-700">
            {formatDzd(order.totalDzd, locale)}
          </span>
        </div>

        {order.status === "PAID" && order.downloads.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {order.downloads.map((d) => (
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

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/account" className="btn-outline">
            {t(locale, "nav.account")}
          </Link>
          {order.status === "PENDING_PAYMENT" && (
            <Link href={`/orders/${order.id}/pay`} className="btn-primary">
              {t(locale, "checkout.proof")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
