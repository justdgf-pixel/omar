"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDZD, PAYMENT_METHODS } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerWilaya: string | null;
  notes: string | null;
  createdAt: string;
  items: { id: string; price: number; product: { name: string; nameFr: string; image: string | null; fileType: string | null } }[];
  downloads: { token: string; downloadCount: number; maxDownloads: number; expiresAt: string }[];
}

const statusConfig: Record<string, { variant: "warning" | "info" | "success" | "danger"; label: string }> = {
  pending: { variant: "warning", label: "En attente de paiement" },
  confirmed: { variant: "info", label: "Paiement confirmé" },
  completed: { variant: "success", label: "Commande terminée" },
  cancelled: { variant: "danger", label: "Commande annulée" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-surface-tertiary rounded-xl w-64 animate-pulse mb-8" />
        <div className="bg-surface-tertiary rounded-2xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Commande introuvable</h2>
        <Link href="/orders"><Button>Voir mes commandes</Button></Link>
      </div>
    );
  }

  const paymentLabel = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label || order.paymentMethod;
  const statusInfo = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block">
            ← Retour aux commandes
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Commande #{order.orderNumber}</h1>
          <p className="text-text-muted mt-1">
            Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
        <Badge variant={statusInfo.variant} className="text-sm">{statusInfo.label}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-4">Produits commandés</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-tertiary flex-shrink-0">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.nameFr} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{item.product.nameFr || item.product.name}</p>
                    {item.product.fileType && <p className="text-xs text-text-muted">{item.product.fileType}</p>}
                  </div>
                  <p className="font-bold text-primary-700">{formatDZD(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          {order.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-semibold text-yellow-800 mb-2">⏳ En attente de paiement</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Veuillez effectuer votre paiement via <strong>{paymentLabel}</strong> et envoyer la preuve de paiement à notre WhatsApp.
              </p>
              <a href="https://wa.me/213555123456" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  Envoyer la preuve sur WhatsApp
                </Button>
              </a>
            </div>
          )}

          {/* Downloads */}
          {order.status === "completed" && order.downloads.length > 0 && (
            <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6">
              <h3 className="font-semibold text-accent-800 mb-2">📥 Téléchargements disponibles</h3>
              {order.downloads.map((dl) => (
                <div key={dl.token} className="flex items-center justify-between mt-3 p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm text-text-secondary">
                      Téléchargé {dl.downloadCount}/{dl.maxDownloads} fois
                    </p>
                    <p className="text-xs text-text-muted">
                      Expire le {new Date(dl.expiresAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <a href={`/api/download/${dl.token}`}>
                    <Button size="sm" variant="secondary">Télécharger</Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-text-primary mb-4">Récapitulatif</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Paiement</span>
                <span className="font-medium">{paymentLabel}</span>
              </div>
              {order.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Téléphone</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
              )}
              {order.customerWilaya && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Wilaya</span>
                  <span className="font-medium">{order.customerWilaya}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4">
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-primary-700">{formatDZD(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
