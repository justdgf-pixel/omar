"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingBag, ArrowRight, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, clearCart, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Votre panier est vide
        </h2>
        <p className="text-gray-500 mb-6">
          Découvrez nos produits numériques et commencez vos achats
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
        >
          Explorer les produits
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Panier ({items.length} produit{items.length > 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Download className="w-6 h-6 text-emerald-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.id}`}
                  className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  par {item.sellerName}
                </p>
                <p className="font-bold text-emerald-600 mt-2">
                  {formatPrice(item.price)}
                </p>
              </div>
              <button
                onClick={() => {
                  removeItem(item.id);
                  toast.success("Retiré du panier");
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              clearCart();
              toast.success("Panier vidé");
            }}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Vider le panier
          </button>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">
              Résumé de la commande
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="text-gray-900">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-emerald-600">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
            >
              Passer la commande
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-gray-400 text-center mt-3">
              Paiement sécurisé par CCP, BaridiMob ou Dahabia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
