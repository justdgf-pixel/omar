import Link from "next/link";
import { formatDzd } from "@/lib/money";
import { pickI18nField, t, type Locale } from "@/lib/i18n";

type Product = {
  id: string;
  slug: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  priceDzd: number;
  compareAtDzd: number | null;
  coverImage: string | null;
  featured: boolean;
  seller?: { storeName: string; storeSlug: string } | null;
  category?: { slug: string; nameAr: string; nameFr: string; nameEn: string } | null;
};

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const title = pickI18nField(
    product as unknown as Record<string, unknown>,
    "title",
    locale,
  );
  const catName = product.category
    ? pickI18nField(
        product.category as unknown as Record<string, unknown>,
        "name",
        locale,
      )
    : "";
  return (
    <Link
      href={`/p/${product.slug}`}
      className="card group flex h-full flex-col overflow-hidden hover:border-brand-300 hover:shadow-lg transition"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-100">
        {product.coverImage ? (
          // Cover may be SVG or any image; <img> is fine.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImage}
            alt={title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-3xl">📦</div>
        )}
        {product.featured && (
          <span className="absolute start-3 top-3 badge-accent">
            {t(locale, "common.featured")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {catName && (
          <span className="text-xs font-medium text-ink-500">{catName}</span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-ink-900">
          {title}
        </h3>
        {product.seller && (
          <span className="text-xs text-ink-500">
            {t(locale, "common.by")} {product.seller.storeName}
          </span>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-brand-700">
            {formatDzd(product.priceDzd, locale)}
          </span>
          {product.compareAtDzd && product.compareAtDzd > product.priceDzd && (
            <span className="text-xs text-ink-400 line-through">
              {formatDzd(product.compareAtDzd, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
