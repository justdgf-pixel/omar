import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDzd } from "@/lib/money";
import { ApproveButtons } from "./approve-buttons";
import type { Locale } from "@/i18n/config";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);
  if (session.user.role !== "ADMIN") redirect(`/${locale}`);

  const [pending, recent, totalUsers, totalProducts] = await Promise.all([
    prisma.order.findMany({
      where: { status: "PENDING_PAYMENT" },
      include: { items: true, customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { status: "PAID" },
      take: 10,
      orderBy: { paidAt: "desc" },
      include: { customer: true },
    }),
    prisma.user.count(),
    prisma.product.count(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {locale === "ar" ? "لوحة الإدارة" : locale === "fr" ? "Administration" : "Admin"}
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label={locale === "ar" ? "بانتظار التحقّق" : locale === "fr" ? "En attente" : "Pending"}
          value={pending.length.toString()}
        />
        <Stat
          label={locale === "ar" ? "المنتجات" : locale === "fr" ? "Produits" : "Products"}
          value={totalProducts.toString()}
        />
        <Stat
          label={locale === "ar" ? "المستخدمون" : locale === "fr" ? "Utilisateurs" : "Users"}
          value={totalUsers.toString()}
        />
      </div>

      <h2 className="mb-3 text-lg font-semibold">
        {locale === "ar"
          ? "طلبات بانتظار التحقّق"
          : locale === "fr"
            ? "Commandes à vérifier"
            : "Orders waiting for verification"}
      </h2>
      <div className="card">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="p-3 text-start">Ref</th>
              <th className="p-3 text-start">Method</th>
              <th className="p-3 text-start">Customer</th>
              <th className="p-3 text-start">Total</th>
              <th className="p-3 text-start">Note</th>
              <th className="p-3 text-start"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pending.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-mono">{o.reference}</td>
                <td className="p-3">{o.paymentMethod}</td>
                <td className="p-3">{o.customer.email}</td>
                <td className="p-3">{formatDzd(o.totalCentimes, locale as Locale)}</td>
                <td className="p-3 max-w-xs truncate text-stone-500">{o.proofNote ?? "—"}</td>
                <td className="p-3">
                  <ApproveButtons orderId={o.id} />
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">
                  {locale === "ar" ? "لا شيء حالياً" : locale === "fr" ? "Rien à valider" : "Nothing pending"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 mb-3 text-lg font-semibold">
        {locale === "ar" ? "أحدث الطلبات المدفوعة" : locale === "fr" ? "Dernières commandes payées" : "Recent paid orders"}
      </h2>
      <div className="card divide-y divide-stone-100">
        {recent.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-3 text-sm">
            <span className="font-mono">{o.reference}</span>
            <span className="text-stone-500">{o.customer.email}</span>
            <span>{formatDzd(o.totalCentimes, locale as Locale)}</span>
          </div>
        ))}
        {recent.length === 0 && (
          <div className="p-6 text-center text-stone-500">—</div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
