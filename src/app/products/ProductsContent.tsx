"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { CATEGORIES } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Product {
  id: string; title: string; price: number; comparePrice: number | null; images: string;
  rating: number; reviewCount: number; downloads: number;
  category: { name: string; slug: string }; seller: { name: string; id: string };
}

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("sort", sort);
    params.set("limit", "20");
    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch { setProducts([]); }
    setLoading(false);
  }, [search, selectedCategory, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1">{total} digital products available</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none">
              <option value="newest">Newest First</option><option value="popular">Most Popular</option><option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className={`${showFilters ? "fixed inset-0 z-50 bg-white p-6" : "hidden"} sm:block sm:relative sm:bg-transparent sm:p-0 sm:w-56 flex-shrink-0`}>
            {showFilters && <div className="flex items-center justify-between sm:hidden mb-4"><h3 className="font-semibold text-lg">Filters</h3><button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button></div>}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Categories</h3>
              <button onClick={() => { setSelectedCategory(""); setShowFilters(false); }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>All Categories</button>
              {CATEGORIES.map((cat) => (
                <button key={cat.slug} onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                  <span>{cat.icon}</span>{cat.name}
                </button>
              ))}
            </div>
          </aside>
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (<div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"><div className="aspect-[4/3] bg-gray-100" /><div className="p-4 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /><div className="h-6 bg-gray-100 rounded w-1/3 mt-4" /></div></div>))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (<ProductCard key={product.id} {...product} />))}
              </div>
            ) : (
              <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-900">No products found</h3><p className="text-gray-500 mt-2">Try adjusting your search or filters</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
