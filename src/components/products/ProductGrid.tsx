"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { useLocaleStore } from "@/store/locale";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  const { t } = useLocaleStore();

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">🔍</p>
        <p className="text-gray-500 text-lg">{t.products.noResults}</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
