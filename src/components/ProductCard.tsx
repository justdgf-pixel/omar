"use client";

import Link from "next/link";
import { ShoppingCart, Star, Download } from "lucide-react";
import { useCart, CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  thumbnail?: string | null;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  category: { name: string; slug: string };
  seller: { id: string; name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const isInCart = items.some((i) => i.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInCart) {
      toast("Déjà dans le panier", { icon: "ℹ️" });
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail || null,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });
    toast.success("Ajouté au panier!");
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Download className="w-12 h-12 text-emerald-300" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
              -{discount}%
            </span>
          )}
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 rounded-lg">
            {product.category.name}
          </span>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-gray-700">
                  {product.rating.toFixed(1)}
                </span>
                <span>({product.reviewCount})</span>
              </div>
            )}
            {product.downloadCount > 0 && (
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>{product.downloadCount}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-600">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl transition-all ${
                isInCart
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-gray-100 text-gray-600 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/25"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
