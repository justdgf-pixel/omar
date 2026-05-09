import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import { approveOrderAction, rejectOrderAction } from "@/app/actions/admin";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  if (user.role !== "ADMIN") redirect("/");
  const locale = await getLocale();

  const pending = await prisma.order.findMany({
    where: { status: "AWAITING_REVIEW" },
    include: { items: { include: { product: true } }, buyer: true },
    orderBy: { createdAt: "asc" },
  });
  const recent = await prisma.order.findMany({
    where: { status: { in: ["PAID", "REJECTED"] } },
    include: { items: true, buyer: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const [usersCount, productsCount, paidCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.aggregate({
      _sum: { totalDzd: true },
      where: { status: "PAID" },
    }),
  ]);

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Admin</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="Utilisateurs" value={String(usersCount)} />
        <Stat label="Produits" value={String(productsCount)} />
        <Stat label="Commandes payées" value={String(paidCount)} />
        <Stat
          label="Revenu total"
          value={formatDzd(totalRevenue._sum.totalDzd ?? 0, locale)}
        />
      </div>

      <h2 className="mt-10 text-lg font-bold">
        Vérifications en attente ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <div className="card mt-3 p-6 text-center text-ink-500">
          {t(locale, "common.empty")}
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {pending.map((o) => (
            <li key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{o.number}</p>
                  <p className="text-xs text-ink-500">
                    {new Date(o.createdAt).toLocaleString()} · {o.method}
                  </p>
                  <p className="text-sm">
                    Acheteur : <strong>{o.buyer.name}</strong> ({o.buyer.email})
                  </p>
                  {o.proofRef && (
                    <p className="text-sm">Réf : <code>{o.proofRef}</code></p>
                  )}
                  {o.buyerNote && (
                    <p className="text-sm text-ink-600">Note : {o.buyerNote}</p>
                  )}
                </div>
                <div className="text-end">
                  <p className="text-lg font-bold">
                    {formatDzd(o.totalDzd, locale)}
                  </p>
                  {o.proofImage && (
                    <a
                      href={o.proofImage}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline mt-2 inline-flex"
                    >
                      Voir le justificatif
                    </a>
                  )}
                </div>
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

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <form action={approveOrderAction} className="flex gap-2">
                  <input type="hidden" name="orderId" value={o.id} />
                  <input
                    name="note"
                    placeholder="Note interne (optionnel)"
                    className="input flex-1"
                  />
                  <button className="btn-primary">✓ Valider</button>
                </form>
                <form action={rejectOrderAction} className="flex gap-2">
                  <input type="hidden" name="orderId" value={o.id} />
                  <input
                    name="note"
                    placeholder="Raison du rejet"
                    className="input flex-1"
                  />
                  <button className="btn-accent">✗ Refuser</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-bold">Commandes récentes</h2>
      <ul className="mt-3 grid gap-2 text-sm">
        {recent.map((o) => (
          <li
            key={o.id}
            className="card flex flex-wrap items-center justify-between gap-2 p-3"
          >
            <span className="font-semibold">{o.number}</span>
            <span className="text-ink-500">{o.buyer.email}</span>
            <span
              className={
                o.status === "PAID"
                  ? "badge-ok"
                  : o.status === "REJECTED"
                    ? "badge-fail"
                    : "badge"
              }
            >
              {o.status}
            </span>
            <span className="font-bold">{formatDzd(o.totalDzd, locale)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-xs text-ink-500">
        <Link href="/admin/products" className="text-brand-700 hover:underline">
          Gérer tous les produits
        </Link>{" "}
        ·{" "}
        <Link href="/admin/users" className="text-brand-700 hover:underline">
          Gérer les utilisateurs
        </Link>
      </p>
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
