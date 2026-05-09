import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { localeFieldsFor, tFor, type Locale, isLocale } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import { Download } from "lucide-react";
import { signDownloadToken } from "@/lib/downloads";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  const fields = localeFieldsFor(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/${locale}/auth/login?next=/${locale}/dashboard`);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        where: { status: "PAID" },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } }
      },
      products: { orderBy: { createdAt: "desc" } }
    }
  });
  if (!user) redirect(`/${locale}/auth/login`);

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <span className="badge bg-brand-50 text-brand-700">{user.role}</span>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">{t("dashboard.purchases")}</h2>
        {user.orders.length === 0 ? (
          <div className="card p-6 text-slate-600">{t("cart.empty")}</div>
        ) : (
          <div className="grid gap-3">
            {user.orders.flatMap((o) =>
              o.items.map((it) => {
                const token = signDownloadToken({ orderItemId: it.id });
                return (
                  <div
                    key={it.id}
                    className="card flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-sand-100">
                      {it.product.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={it.product.coverImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{it.product[fields.title]}</div>
                      <div className="text-xs text-slate-500">
                        {o.number} · {formatDzd(it.unitDzd, locale)}
                      </div>
                    </div>
                    <a
                      href={`/api/downloads/${token}`}
                      className="btn-primary"
                    >
                      <Download size={16} /> {t("product.download")}
                    </a>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("dashboard.products")}</h2>
          <Link href={`/${locale}/sell`} className="btn-secondary">
            {t("dashboard.newProduct")}
          </Link>
        </div>
        {user.products.length === 0 ? (
          <div className="card mt-3 p-6 text-slate-600">{t("product.empty")}</div>
        ) : (
          <div className="card mt-3 divide-y divide-slate-100">
            {user.products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4"
              >
                <div className="h-14 w-14 overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-sand-100">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{p[fields.title]}</div>
                  <div className="text-xs text-slate-500">
                    {formatDzd(p.priceDzd, locale)}
                  </div>
                </div>
                <span
                  className={`badge ${
                    p.status === "PUBLISHED"
                      ? "bg-brand-100 text-brand-800"
                      : p.status === "PENDING_REVIEW"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {p.status.replace("_", " ").toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
