import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDzd } from "@/lib/money";
import type { Locale } from "@/i18n/config";

const statusBadge: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-brand-100 text-brand-800",
  REJECTED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-stone-200 text-stone-700",
  REFUNDED: "bg-stone-200 text-stone-700",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      downloads: true,
    },
  });
  if (!order) notFound();
  if (order.customerId !== session.user.id && session.user.role !== "ADMIN") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">
        {locale === "ar" ? "طلب" : locale === "fr" ? "Commande" : "Order"} {order.reference}
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        <span className={`badge ${statusBadge[order.status]}`}>{order.status}</span>
      </p>

      <div className="card divide-y divide-stone-100">
        {order.items.map((it) => (
          <div key={it.id} className="flex items-center justify-between p-4">
            <Link href={`/${locale}/p/${it.product.slug}`} className="font-medium hover:underline">
              {it.titleSnapshot}
            </Link>
            <span>{formatDzd(it.priceCentimes, locale as Locale)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 font-semibold">
          <span>{locale === "ar" ? "الإجمالي" : locale === "fr" ? "Total" : "Total"}</span>
          <span>{formatDzd(order.totalCentimes, locale as Locale)}</span>
        </div>
      </div>

      {order.status === "PENDING_PAYMENT" && (
        <div className="card mt-6 p-6">
          <h2 className="mb-2 font-semibold">
            {locale === "ar"
              ? "بانتظار تأكيد الدفع"
              : locale === "fr"
                ? "En attente de validation du paiement"
                : "Waiting for payment confirmation"}
          </h2>
          <p className="text-sm text-stone-600">
            {locale === "ar"
              ? "بمجرّد التأكيد ستظهر روابط التحميل هنا. يصلك إشعار بالبريد الإلكتروني."
              : locale === "fr"
                ? "Dès validation, les liens de téléchargement apparaîtront ici. Vous recevrez un e-mail."
                : "Once confirmed, your download links will appear here. We'll email you."}
          </p>
        </div>
      )}

      {order.status === "PAID" && order.downloads.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="mb-3 font-semibold">
            {locale === "ar" ? "تحميلاتك" : locale === "fr" ? "Vos téléchargements" : "Your downloads"}
          </h2>
          <ul className="space-y-2">
            {order.downloads.map((d) => {
              const item = order.items.find((i) => i.productId === d.productId);
              return (
                <li key={d.id} className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
                  <span>{item?.titleSnapshot ?? d.productId}</span>
                  <a className="btn-primary" href={`/api/download/${d.token}`} download>
                    {locale === "ar" ? "تحميل" : locale === "fr" ? "Télécharger" : "Download"}
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-stone-500">
            {locale === "ar"
              ? `تنتهي الصلاحية في ${order.downloads[0]?.expiresAt.toLocaleDateString("ar-DZ")}`
              : `Expires ${order.downloads[0]?.expiresAt.toLocaleDateString()}`}
          </p>
        </div>
      )}
    </div>
  );
}
