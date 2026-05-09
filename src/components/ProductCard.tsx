import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { formatDzd } from "@/lib/money";
import { pickLocalized } from "@/lib/i18n-helpers";

type Product = {
  id: string;
  slug: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  priceCentimes: number;
  coverUrl: string | null;
  category: { nameAr: string; nameFr: string; nameEn: string; icon: string | null };
};

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const title = pickLocalized(product, "title", locale);
  const desc = pickLocalized(product, "desc", locale);
  const cat = pickLocalized(product.category, "name", locale);

  return (
    <Link
      href={`/${locale}/p/${product.slug}`}
      className="card flex h-full flex-col overflow-hidden transition hover:shadow-md"
    >
      <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-50 to-brand-200">
        {product.coverUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={product.coverUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            {product.category.icon ?? "📦"}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="badge w-fit">{cat}</span>
        <h3 className="line-clamp-2 font-semibold text-stone-900">{title}</h3>
        <p className="line-clamp-2 text-sm text-stone-500">{desc}</p>
        <div className="mt-auto pt-2 text-lg font-bold text-brand-700">
          {formatDzd(product.priceCentimes, locale)}
        </div>
      </div>
    </Link>
  );
}
