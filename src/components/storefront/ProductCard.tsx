"use client";

import Link from "next/link";
import { formatDZD } from "@/lib/utils";
import { useCartStore, CartItem } from "@/lib/store";
import Button from "@/components/ui/Button";

interface Product {
  id: string;
  name: string;
  nameFr: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string | null;
  fileType: string | null;
  fileSize: string | null;
  category: { name: string; nameFr: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.id === product.id);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const item: CartItem = {
      id: product.id,
      name: product.nameFr || product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    };
    addItem(item);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary-100/50 hover:-translate-y-1">
        <div className="relative aspect-[4/3] bg-surface-tertiary overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.nameFr || product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              -{discount}%
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-lg text-text-secondary">
            {product.category.nameFr || product.category.name}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-text-primary line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.nameFr || product.name}
          </h3>

          <div className="flex items-center gap-2 mb-1">
            {product.fileType && (
              <span className="text-xs text-text-muted bg-surface-tertiary px-2 py-0.5 rounded-md">{product.fileType}</span>
            )}
            {product.fileSize && (
              <span className="text-xs text-text-muted">{product.fileSize}</span>
            )}
          </div>

          <div className="flex items-end justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-primary-700">{formatDZD(product.price)}</span>
              {product.comparePrice && (
                <span className="ml-2 text-sm text-text-muted line-through">{formatDZD(product.comparePrice)}</span>
              )}
            </div>
            <Button
              variant={inCart ? "secondary" : "primary"}
              size="sm"
              onClick={handleAdd}
              disabled={inCart}
            >
              {inCart ? "✓" : "+"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
