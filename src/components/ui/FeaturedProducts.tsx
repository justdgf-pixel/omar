"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string; title: string; price: number; comparePrice: number | null;
  images: string; rating: number; reviewCount: number; downloads: number;
  category: { name: string; slug: string }; seller: { name: string; id: string };
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=8")
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-gray-500 text-lg">Top-rated digital products from Algerian creators</p>
          </div>
          <Link href="/products" className="hidden md:inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (<div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"><div className="aspect-[4/3] bg-gray-100" /><div className="p-4 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /><div className="h-6 bg-gray-100 rounded w-1/3 mt-4" /></div></div>))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (<ProductCard key={product.id} {...product} />))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900">Products Coming Soon</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Be the first to sell on DigiDZ! Sign up as a seller and start listing your digital products.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">Start Selling</Link>
          </div>
        )}
      </div>
    </section>
  );
}
