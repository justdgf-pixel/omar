"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { formatPrice, truncate } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  rating: number;
  reviewCount: number;
  totalSales: number;
  featured: boolean;
  category: { name: string; nameAr?: string | null };
  fileType?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCart) {
      addItem({
        id: product.id,
        name: product.nameAr ?? product.name,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        slug: product.slug,
      });
      toast({ title: "أضيف للسلة ✓", variant: "success" });
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.nameAr ?? product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">📦</span>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-emerald-600 text-white">مميز</Badge>
          )}
          {product.fileType && (
            <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] uppercase">
              {product.fileType}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-emerald-600 font-medium mb-1">
            {product.category.nameAr ?? product.category.name}
          </p>
          <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-snug">
            {truncate(product.nameAr ?? product.name, 50)}
          </h3>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {truncate(product.description, 80)}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {product.totalSales} مبيعة
            </span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-700">
              {formatPrice(product.price, product.currency)}
            </span>
            <Button
              size="sm"
              variant={inCart ? "secondary" : "default"}
              onClick={handleAdd}
              className="text-xs"
            >
              {inCart ? (
                "في السلة ✓"
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" /> أضف للسلة
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
