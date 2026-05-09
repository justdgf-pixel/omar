"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatDZD } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Votre panier est vide</h2>
        <p className="text-text-secondary mb-6">Ajoutez des produits pour commencer vos achats</p>
        <Link href="/products"><Button size="lg">Explorer les produits</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Votre Panier</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>Vider le panier</Button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl border border-border p-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-tertiary flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-2xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.slug}`} className="font-semibold text-text-primary hover:text-primary-600 transition-colors line-clamp-1">
                {item.name}
              </Link>
              <p className="text-sm text-text-muted mt-0.5">Produit numérique</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-700">{formatDZD(item.price)}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-500 hover:text-red-700 mt-1 cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-secondary rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary">Sous-total</span>
          <span className="font-semibold">{formatDZD(total())}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <span className="text-text-secondary">Frais de livraison</span>
          <span className="text-accent-600 font-medium">Gratuit (digital)</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-bold text-text-primary">Total</span>
          <span className="text-2xl font-bold text-primary-700">{formatDZD(total())}</span>
        </div>

        <Link href="/checkout" className="block">
          <Button size="lg" className="w-full">
            Procéder au paiement
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}
