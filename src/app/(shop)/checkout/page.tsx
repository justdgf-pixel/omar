"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  Copy,
  ShieldCheck,
  Download,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  {
    id: "ccp",
    name: "Compte CCP",
    description: "Virement postal Algérie Poste",
    color: "yellow",
    instructions:
      "Effectuez un virement vers le compte CCP ci-dessous et fournissez le numéro de transaction.",
    details: {
      label: "Numéro CCP",
      value: "00799999 clé 99",
      name: "DigiStore DZ",
    },
  },
  {
    id: "baridimob",
    name: "BaridiMob",
    description: "Paiement mobile Algérie Poste",
    color: "green",
    instructions:
      "Envoyez le montant via BaridiMob au numéro ci-dessous et entrez la référence de transaction.",
    details: {
      label: "Numéro BaridiMob",
      value: "00799999",
      name: "DigiStore DZ",
    },
  },
  {
    id: "dahabia",
    name: "Carte Dahabia",
    description: "Carte de paiement électronique",
    color: "blue",
    instructions:
      "Effectuez le paiement avec votre carte Dahabia via le portail e-paiement et entrez le numéro de confirmation.",
    details: {
      label: "RIP Dahabia",
      value: "007999 9999999999 99",
      name: "DigiStore DZ",
    },
  },
];

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setIsLoggedIn(!!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (items.length === 0 && !orderComplete) {
    router.push("/cart");
    return null;
  }

  if (isLoggedIn === false) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Connexion requise
        </h2>
        <p className="text-gray-500 mb-6">
          Veuillez vous connecter pour passer votre commande
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }
    if (!paymentRef.trim()) {
      toast.error("Veuillez entrer la référence de paiement");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id })),
          paymentMethod: selectedMethod,
          paymentRef: paymentRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la commande");
        return;
      }

      setOrderId(data.order.id);
      setOrderComplete(true);
      clearCart();
      toast.success("Commande envoyée avec succès!");
    } catch {
      toast.error("Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Commande confirmée!
        </h2>
        <p className="text-gray-500 mb-2">
          Votre commande a été reçue et est en cours de traitement.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Numéro de commande:{" "}
          <span className="font-mono text-gray-600">
            {orderId.slice(0, 8).toUpperCase()}
          </span>
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
          <p className="text-sm text-amber-800">
            <strong>Prochaines étapes:</strong> Notre équipe va vérifier votre
            paiement. Une fois confirmé, vous recevrez un lien de
            téléchargement pour vos produits. Cela prend généralement quelques
            minutes à quelques heures.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard/orders"
            className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600"
          >
            Voir mes commandes
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
          >
            Continuer les achats
          </Link>
        </div>
      </div>
    );
  }

  const selectedMethodInfo = PAYMENT_METHODS.find(
    (m) => m.id === selectedMethod
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au panier
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Finaliser la commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Choisir le mode de paiement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedMethod === method.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {method.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          {selectedMethodInfo && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">
                Instructions de paiement
              </h3>
              <p className="text-sm text-gray-600">
                {selectedMethodInfo.instructions}
              </p>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">
                  {selectedMethodInfo.details.label}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-lg font-bold text-gray-900">
                      {selectedMethodInfo.details.value}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedMethodInfo.details.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        selectedMethodInfo.details.value
                      );
                      toast.success("Copié!");
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-emerald-800">
                  Montant à envoyer:{" "}
                  <span className="text-lg">
                    {formatPrice(getTotal())}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Référence de paiement / Numéro de transaction
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Entrez le numéro de transaction..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">
              Résumé
            </h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                        <Download className="w-4 h-4 text-emerald-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="flex justify-between text-base font-bold mb-6">
              <span>Total</span>
              <span className="text-emerald-600">
                {formatPrice(getTotal())}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedMethod}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Traitement..." : "Confirmer la commande"}
            </button>

            <div className="flex items-center gap-2 justify-center mt-4 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4" />
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
