"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">سلتك فارغة</h2>
        <p className="text-gray-500 mb-6">لم تضف أي منتجات بعد.</p>
        <Link href="/products">
          <Button size="lg">تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        سلة التسوق ({items.length} منتج)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
            >
              <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-emerald-700 truncate block">
                  {item.name}
                </Link>
                <p className="text-emerald-700 font-bold text-sm mt-0.5">
                  {formatPrice(item.price, item.currency)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate ml-2">{item.name}</span>
                  <span className="text-gray-900 shrink-0">{formatPrice(item.price, item.currency)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-5">
              <div className="flex justify-between font-bold text-gray-900">
                <span>المجموع</span>
                <span className="text-emerald-700 text-lg">{formatPrice(total, "DZD")}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                إتمام الشراء <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="mt-4 text-center">
              <Link href="/products" className="text-sm text-emerald-600 hover:underline">
                مواصلة التسوق
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
              {["🔒 دفع آمن ومشفر", "⚡ تسليم فوري", "💳 CIB & BaridiMob & BaridiPay"].map((badge) => (
                <p key={badge} className="text-xs text-gray-500 text-center">{badge}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
