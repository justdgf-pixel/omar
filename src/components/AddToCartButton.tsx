"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart, type CartItem } from "@/store/cart";
import type { Locale } from "@/i18n/config";

export function AddToCartButton({ product, locale }: { product: CartItem; locale: Locale }) {
  const t = useTranslations("product");
  const router = useRouter();
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.items.some((i) => i.productId === product.productId));
  const [pending, setPending] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn-primary"
        onClick={() => {
          setPending(true);
          add(product);
          router.push(`/${locale}/checkout`);
        }}
      >
        {pending ? "..." : t("buyNow")}
      </button>
      <button
        className="btn-secondary"
        disabled={inCart}
        onClick={() => add(product)}
      >
        {inCart
          ? locale === "ar"
            ? "في السلة ✓"
            : locale === "fr"
              ? "Dans le panier ✓"
              : "In cart ✓"
          : t("addToCart")}
      </button>
    </div>
  );
}
