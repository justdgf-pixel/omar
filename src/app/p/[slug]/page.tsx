import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { pickI18nField, t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import { addToCartAction, buyNowAction } from "@/app/actions/cart";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { seller: true, category: true },
  });
  if (!p || p.status !== "PUBLISHED") notFound();

  const title = pickI18nField(
    p as unknown as Record<string, unknown>,
    "title",
    locale,
  );
  const desc = pickI18nField(
    p as unknown as Record<string, unknown>,
    "desc",
    locale,
  );
  const catName = pickI18nField(
    p.category as unknown as Record<string, unknown>,
    "name",
    locale,
  );

  return (
    <div className="container-page py-8">
      <nav className="mb-4 text-sm text-ink-500">
        <a href="/catalog" className="hover:underline">
          {t(locale, "nav.catalog")}
        </a>
        {" / "}
        <a href={`/c/${p.category.slug}`} className="hover:underline">
          {catName}
        </a>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden">
          {p.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.coverImage}
              alt={title}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[16/10] place-items-center text-5xl">📦</div>
          )}
        </div>

        <div>
          <span className="badge-brand mb-2">{catName}</span>
          <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {t(locale, "common.by")}{" "}
            <a
              href={`/s/${p.seller.storeSlug}`}
              className="font-medium text-brand-700 hover:underline"
            >
              {p.seller.storeName}
            </a>
          </p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand-700">
              {formatDzd(p.priceDzd, locale)}
            </span>
            {p.compareAtDzd && p.compareAtDzd > p.priceDzd && (
              <span className="text-sm text-ink-400 line-through">
                {formatDzd(p.compareAtDzd, locale)}
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-ink-700">{desc}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <form action={addToCartAction}>
              <input type="hidden" name="productId" value={p.id} />
              <button className="btn-outline">{t(locale, "common.add_to_cart")}</button>
            </form>
            <form action={buyNowAction}>
              <input type="hidden" name="productId" value={p.id} />
              <button className="btn-primary">{t(locale, "common.buy_now")}</button>
            </form>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-ink-600 sm:grid-cols-2">
            <div className="card p-3">
              <p className="font-semibold text-ink-900">⚡ Livraison instantanée</p>
              <p>Téléchargement immédiat après vérification du paiement.</p>
            </div>
            <div className="card p-3">
              <p className="font-semibold text-ink-900">🇩🇿 Paiements locaux</p>
              <p>CIB, Edahabia, BaridiMob, CCP — tout est accepté.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
