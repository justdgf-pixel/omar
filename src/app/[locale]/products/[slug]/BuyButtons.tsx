"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import type { Locale } from "@/lib/i18n";
import { ShoppingBag, Zap } from "lucide-react";

interface Props {
  locale: Locale;
  t: { addToCart: string; buyNow: string };
  product: {
    id: string;
    slug: string;
    title: string;
    priceDzd: number;
    cover?: string | null;
  };
}

export default function BuyButtons({ locale, t, product }: Props) {
  const { add } = useCart();
  const router = useRouter();

  function buyNow() {
    add({
      id: product.id,
      slug: product.slug,
      title: product.title,
      priceDzd: product.priceDzd,
      cover: product.cover ?? undefined
    });
    router.push(`/${locale}/checkout`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={buyNow} className="btn-primary">
        <Zap size={16} />
        {t.buyNow}
      </button>
      <button
        onClick={() =>
          add({
            id: product.id,
            slug: product.slug,
            title: product.title,
            priceDzd: product.priceDzd,
            cover: product.cover ?? undefined
          })
        }
        className="btn-secondary"
      >
        <ShoppingBag size={16} />
        {t.addToCart}
      </button>
    </div>
  );
}
