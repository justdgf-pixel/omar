"use client";

import Link from "next/link";
import { Star, ShoppingCart, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  images: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  category: { name: string; slug: string };
  seller: { name: string; id: string };
}

export default function ProductCard({ id, title, price, comparePrice, images, rating, reviewCount, downloads, category, seller }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const isInCart = items.some((i) => i.id === id);
  const imageList = JSON.parse(images || "[]");
  const mainImage = imageList[0] || "/images/placeholder.svg";
  const discount = comparePrice && comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
  const emoji = category.slug === "ebooks" ? "📚" : category.slug === "courses" ? "🎓" : category.slug === "templates" ? "📋" : category.slug === "software" ? "💻" : category.slug === "graphics" ? "🎨" : category.slug === "music" ? "🎵" : "📦";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all duration-300">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">{emoji}</div>
          {discount && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>}
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-gray-700">{category.name}</span>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${id}`}><h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">{title}</h3></Link>
        <p className="text-xs text-gray-500 mt-1.5">by {seller.name}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
          <span className="text-xs text-gray-400 flex items-center gap-0.5 ml-auto"><Download className="w-3 h-3" /> {downloads}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
            {comparePrice && comparePrice > price && <span className="text-sm text-gray-400 line-through">{formatPrice(comparePrice)}</span>}
          </div>
          <button onClick={(e) => { e.preventDefault(); if (!isInCart) addItem({ id, title, price, image: mainImage, sellerId: seller.id, sellerName: seller.name }); }}
            className={`p-2.5 rounded-xl transition-all ${isInCart ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-emerald-500 hover:text-white"}`}>
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
