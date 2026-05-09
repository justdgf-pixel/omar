"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";

type Product = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  previewUrl?: string | null;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = () => {
    if (!inCart) {
      addItem({
        id: product.id,
        name: product.nameAr ?? product.name,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        slug: product.slug,
      });
      toast({ title: "أضيف للسلة بنجاح ✓", variant: "success" });
    }
  };

  return (
    <div className="space-y-3">
      {inCart ? (
        <Link href="/cart">
          <Button className="w-full" size="lg">
            <ShoppingCart className="h-5 w-5" /> اذهب إلى السلة
          </Button>
        </Link>
      ) : (
        <Button className="w-full" size="lg" onClick={handleAdd}>
          <ShoppingCart className="h-5 w-5" /> أضف إلى السلة
        </Button>
      )}

      {product.previewUrl && (
        <a href={product.previewUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full" size="lg">
            <Eye className="h-5 w-5" /> معاينة المنتج
          </Button>
        </a>
      )}
    </div>
  );
}
