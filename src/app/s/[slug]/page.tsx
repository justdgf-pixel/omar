import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";

export default async function SellerStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const seller = await prisma.sellerProfile.findUnique({
    where: { storeSlug: slug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: { category: true, seller: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!seller) notFound();

  return (
    <div className="container-page py-8">
      <header className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">{seller.storeName}</h1>
          {seller.bio && <p className="mt-1 max-w-prose text-sm text-ink-600">{seller.bio}</p>}
        </div>
        <span className="badge-brand">/s/{seller.storeSlug}</span>
      </header>

      <h2 className="mt-8 text-lg font-bold">{t(locale, "nav.catalog")}</h2>
      {seller.products.length === 0 ? (
        <div className="card mt-3 p-8 text-center text-ink-500">
          {t(locale, "common.empty")}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {seller.products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
