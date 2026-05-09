"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatDzd } from "@/lib/money";
import type { Locale } from "@/lib/i18n";
import { ShoppingBag } from "lucide-react";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceDzd: number;
  cover?: string | null;
  sellerName?: string | null;
}

export interface ProductCardMessages {
  addToCart: string;
  byAuthor: string;
}

export default function ProductCard({
  product,
  locale,
  messages: m
}: {
  product: ProductCardData;
  locale: Locale;
  messages: ProductCardMessages;
}) {
  const { add } = useCart();

  return (
    <div className="card group flex flex-col overflow-hidden">
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-sand-100 to-brand-50"
      >
        {product.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.cover}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-brand-700">
            ✦
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-brand-700"
          >
            {product.title}
          </Link>
          {product.sellerName ? (
            <div className="mt-0.5 text-xs text-slate-500">
              {m.byAuthor} {product.sellerName}
            </div>
          ) : null}
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-bold text-brand-700">
            {formatDzd(product.priceDzd, locale)}
          </span>
          <button
            type="button"
            onClick={() =>
              add({
                id: product.id,
                slug: product.slug,
                title: product.title,
                priceDzd: product.priceDzd,
                cover: product.cover ?? undefined
              })
            }
            className="btn-secondary !py-2 !px-3"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">{m.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
