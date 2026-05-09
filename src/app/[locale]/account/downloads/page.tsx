import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDzd } from "@/lib/money";
import type { Locale } from "@/i18n/config";

export default async function MyDownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { items: true, downloads: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {locale === "ar" ? "تحميلاتي" : locale === "fr" ? "Mes téléchargements" : "My downloads"}
      </h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <Link
                href={`/${locale}/orders/${o.id}`}
                className="font-mono text-sm hover:underline"
              >
                {o.reference}
              </Link>
              <span className="text-sm text-stone-500">
                {formatDzd(o.totalCentimes, locale as Locale)} · {o.status}
              </span>
            </div>
            <ul className="space-y-2 text-sm">
              {o.items.map((it) => {
                const dl = o.downloads.find((d) => d.productId === it.productId);
                return (
                  <li
                    key={it.id}
                    className="flex items-center justify-between rounded-md bg-stone-50 px-3 py-2"
                  >
                    <span>{it.titleSnapshot}</span>
                    {dl ? (
                      <a className="text-brand-700 hover:underline" href={`/api/download/${dl.token}`}>
                        ⬇{" "}
                        {locale === "ar"
                          ? "تحميل"
                          : locale === "fr"
                            ? "Télécharger"
                            : "Download"}
                      </a>
                    ) : (
                      <span className="text-xs text-stone-400">
                        {locale === "ar"
                          ? "في انتظار الدفع"
                          : locale === "fr"
                            ? "en attente"
                            : "pending"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="card p-10 text-center text-stone-500">
            {locale === "ar"
              ? "لا توجد طلبات بعد."
              : locale === "fr"
                ? "Aucune commande pour le moment."
                : "No orders yet."}
          </div>
        )}
      </div>
    </div>
  );
}
