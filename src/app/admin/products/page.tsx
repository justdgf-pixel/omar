import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/");
  const locale = await getLocale();
  const products = await prisma.product.findMany({
    include: { seller: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Tous les produits</h1>
      <ul className="mt-4 grid gap-2 text-sm">
        {products.map((p) => (
          <li key={p.id} className="card flex flex-wrap items-center gap-3 p-3">
            {p.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.coverImage} alt="" className="h-12 w-20 rounded object-cover" />
            )}
            <span className="flex-1 font-semibold">
              {pickI18nField(p as unknown as Record<string, unknown>, "title", locale)}
            </span>
            <span className="text-ink-500">{p.seller.storeName}</span>
            <span className="badge">{p.status}</span>
            <span className="font-bold">{formatDzd(p.priceDzd, locale)}</span>
            <Link href={`/p/${p.slug}`} className="btn-ghost">↗</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
