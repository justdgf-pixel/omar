"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, clearCart, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="max-w-4xl mx-auto px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-100 rounded w-1/4" /><div className="h-24 bg-gray-100 rounded-2xl" /></div></div>;

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><ShoppingCart className="w-10 h-10 text-gray-400" /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our collection of digital products</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">Browse Products <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft className="w-4 h-4" /> Continue Shopping</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-emerald-700 line-clamp-2">{item.title}</Link>
                  <p className="text-sm text-gray-500 mt-0.5">by {item.sellerName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice(item.price)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 mt-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Cart</button>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal ({items.length} items)</span><span>{formatPrice(totalPrice())}</span></div>
                <div className="flex justify-between text-gray-600"><span>Processing fee</span><span className="text-emerald-600">Free</span></div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-gray-900 text-lg"><span>Total</span><span>{formatPrice(totalPrice())}</span></div>
              </div>
              <Link href="/checkout" className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">Proceed to Checkout <ArrowRight className="w-4 h-4" /></Link>
              <div className="mt-4 text-xs text-gray-500 text-center space-y-1"><p>Accepted payment methods:</p><p>🏦 CCP &bull; 📱 BaridiMob &bull; 💳 Edahabia</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
