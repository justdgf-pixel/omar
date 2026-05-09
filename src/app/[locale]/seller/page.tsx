import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDzd } from "@/lib/money";
import { pickLocalized } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/config";

export default async function SellerDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);
  if (session.user.role === "CUSTOMER") {
    return (
      <div className="mx-auto max-w-2xl p-12 text-center">
        <p className="text-stone-600">
          {locale === "ar"
            ? "حسابك حالياً مشتري. حدِّثه ليصبح بائع من إعدادات الحساب."
            : locale === "fr"
              ? "Votre compte est en mode acheteur. Passez en mode vendeur depuis les réglages."
              : "Your account is set to buyer. Switch to seller mode from your settings."}
        </p>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { sellerId: session.user.id },
    include: { category: true, orderItems: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSales = products.reduce((acc, p) => acc + p.orderItems.length, 0);
  const totalEarnings = products.reduce(
    (acc, p) => acc + p.orderItems.length * p.priceCentimes,
    0,
  );
  const fee = Number(process.env.PLATFORM_FEE_PERCENT ?? 10);
  const payout = Math.round(totalEarnings * (1 - fee / 100));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "لوحة البائع" : locale === "fr" ? "Espace vendeur" : "Seller dashboard"}
        </h1>
        <Link href={`/${locale}/seller/new`} className="btn-primary">
          {locale === "ar" ? "إضافة منتج" : locale === "fr" ? "Nouveau produit" : "New product"}
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label={locale === "ar" ? "المنتجات" : locale === "fr" ? "Produits" : "Products"}
          value={products.length.toString()}
        />
        <Stat
          label={locale === "ar" ? "المبيعات" : locale === "fr" ? "Ventes" : "Sales"}
          value={totalSales.toString()}
        />
        <Stat
          label={
            locale === "ar"
              ? `أرباح صافية (بعد ${fee}٪)`
              : locale === "fr"
                ? `Revenus nets (après ${fee}%)`
                : `Net earnings (after ${fee}%)`
          }
          value={formatDzd(payout, locale as Locale)}
        />
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-start text-stone-500">
            <tr>
              <th className="p-3 text-start">
                {locale === "ar" ? "المنتج" : locale === "fr" ? "Produit" : "Product"}
              </th>
              <th className="p-3 text-start">
                {locale === "ar" ? "التصنيف" : locale === "fr" ? "Catégorie" : "Category"}
              </th>
              <th className="p-3 text-start">
                {locale === "ar" ? "السعر" : locale === "fr" ? "Prix" : "Price"}
              </th>
              <th className="p-3 text-start">
                {locale === "ar" ? "المبيعات" : locale === "fr" ? "Ventes" : "Sales"}
              </th>
              <th className="p-3 text-start">
                {locale === "ar" ? "الحالة" : locale === "fr" ? "Statut" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-medium">{pickLocalized(p, "title", locale as Locale)}</td>
                <td className="p-3">{pickLocalized(p.category, "name", locale as Locale)}</td>
                <td className="p-3">{formatDzd(p.priceCentimes, locale as Locale)}</td>
                <td className="p-3">{p.orderItems.length}</td>
                <td className="p-3">
                  <span className={`badge ${p.published ? "" : "bg-stone-200 text-stone-700"}`}>
                    {p.published
                      ? locale === "ar" ? "منشور" : locale === "fr" ? "Publié" : "Published"
                      : locale === "ar" ? "مسودة" : locale === "fr" ? "Brouillon" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">
                  {locale === "ar"
                    ? "لا توجد منتجات بعد."
                    : locale === "fr"
                      ? "Aucun produit pour le moment."
                      : "No products yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
