import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pickLocalized } from "@/lib/i18n-helpers";
import { formatDzd } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Locale } from "@/i18n/config";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, seller: true },
  });
  if (!product || !product.published) notFound();

  const title = pickLocalized(product, "title", locale as Locale);
  const desc = pickLocalized(product, "desc", locale as Locale);
  const cat = pickLocalized(product.category, "name", locale as Locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-brand-200">
          {product.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.coverUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-7xl">
              {product.category.icon ?? "📦"}
            </div>
          )}
        </div>
        <div>
          <span className="badge mb-3">{cat}</span>
          <h1 className="text-2xl font-bold text-stone-900 md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {locale === "ar" ? "بواسطة" : locale === "fr" ? "par" : "by"} {product.seller.name ?? product.seller.email}
          </p>
          <div className="mt-4 text-3xl font-bold text-brand-700">
            {formatDzd(product.priceCentimes, locale as Locale)}
          </div>
          <div className="mt-2 text-sm text-stone-500">
            {(product.fileSize / (1024 * 1024)).toFixed(2)} MB · {product.fileMime}
          </div>
          <div className="mt-6">
            <AddToCartButton
              locale={locale as Locale}
              product={{
                productId: product.id,
                slug: product.slug,
                title,
                priceCentimes: product.priceCentimes,
                coverUrl: product.coverUrl,
              }}
            />
          </div>
          <article className="prose prose-stone mt-8 max-w-none whitespace-pre-line text-stone-700">
            {desc}
          </article>
        </div>
      </div>
    </div>
  );
}
