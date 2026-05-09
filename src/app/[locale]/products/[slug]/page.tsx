import { prisma } from "@/lib/db";
import { localeFieldsFor, tFor, type Locale, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { formatDzd } from "@/lib/money";
import BuyButtons from "./BuyButtons";

export const dynamic = "force-dynamic";

interface Props {
  params: { locale: string; slug: string };
}

export default async function ProductPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = tFor(locale);
  const fields = localeFieldsFor(locale);

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { seller: true, category: true }
  });
  if (!product || product.status !== "PUBLISHED") notFound();

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
      <div className="card overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-sand-100">
          {product.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.coverImage}
              alt={product[fields.title]}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-5xl text-brand-700">
              ✦
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {product.category ? (
          <span className="badge w-fit bg-brand-50 text-brand-700">
            {product.category[fields.name]}
          </span>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {product[fields.title]}
        </h1>
        <div className="mt-1 text-sm text-slate-500">
          {t("product.byAuthor")}{" "}
          <span className="font-medium text-slate-700">
            {product.seller?.name ?? product.seller?.email}
          </span>
        </div>
        <div className="mt-4 text-3xl font-bold text-brand-700">
          {formatDzd(product.priceDzd, locale)}
        </div>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
          {product[fields.description]}
        </p>

        <div className="mt-6">
          <BuyButtons
            locale={locale}
            t={{
              addToCart: t("product.addToCart"),
              buyNow: t("product.buyNow")
            }}
            product={{
              id: product.id,
              slug: product.slug,
              title: product[fields.title],
              priceDzd: product.priceDzd,
              cover: product.coverImage
            }}
          />
        </div>

        {product.fileSizeBytes ? (
          <div className="mt-6 text-xs text-slate-500">
            {(product.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB ·{" "}
            {product.fileName}
          </div>
        ) : null}
      </div>
    </div>
  );
}
