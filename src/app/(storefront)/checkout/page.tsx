"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useAuthStore } from "@/lib/store";
import { formatDZD, WILAYAS, PAYMENT_METHODS } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [notes, setNotes] = useState("");

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Connexion requise</h2>
        <p className="text-text-secondary mb-6">Veuillez vous connecter pour finaliser votre commande</p>
        <Link href="/auth?mode=login"><Button size="lg">Se connecter</Button></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Panier vide</h2>
        <p className="text-text-secondary mb-6">Ajoutez des produits avant de passer commande</p>
        <Link href="/products"><Button size="lg">Voir les produits</Button></Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError("Veuillez choisir un moyen de paiement");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id })),
          paymentMethod,
          phone,
          wilaya,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/orders/${data.order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              Moyen de paiement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? "border-primary-500" : "border-border"
                  }`}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{method.label}</p>
                    <p className="text-xs text-text-muted">{method.labelAr}</p>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800 font-medium mb-1">Instructions de paiement :</p>
                {paymentMethod === "ccp" && (
                  <p className="text-sm text-yellow-700">Envoyez le montant au CCP : <strong>00799999 CLÉ 99</strong>. Gardez le reçu comme preuve de paiement.</p>
                )}
                {paymentMethod === "baridimob" && (
                  <p className="text-sm text-yellow-700">Envoyez le montant via BaridiMob au numéro : <strong>07799999</strong>. Gardez la capture d&apos;écran.</p>
                )}
                {paymentMethod === "edahabia" && (
                  <p className="text-sm text-yellow-700">Utilisez votre carte EDAHABIA pour payer en ligne. Le paiement sera traité automatiquement.</p>
                )}
                {paymentMethod === "bank_transfer" && (
                  <p className="text-sm text-yellow-700">Effectuez un virement bancaire. Les détails vous seront envoyés par email après la commande.</p>
                )}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              Informations de contact
            </h2>

            <div className="space-y-4">
              <Input
                label="Numéro de téléphone"
                placeholder="0555 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Wilaya</label>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">Sélectionnez votre wilaya</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Instructions spéciales..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary line-clamp-1 flex-1 mr-2">{item.name}</span>
                  <span className="font-medium text-text-primary whitespace-nowrap">{formatDZD(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-text-primary">Total</span>
                <span className="text-xl font-bold text-primary-700">{formatDZD(total())}</span>
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Confirmer la commande
            </Button>

            <p className="text-xs text-text-muted text-center mt-3">
              En confirmant, vous acceptez nos conditions de vente
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
