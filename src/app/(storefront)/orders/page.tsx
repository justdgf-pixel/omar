"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDZD } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: { product: { name: string; nameFr: string } }[];
}

const statusVariant: Record<string, "warning" | "info" | "success" | "danger"> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
};

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  completed: "Terminée",
  cancelled: "Annulée",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Mes Commandes</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-tertiary rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Mes Commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Aucune commande</h3>
          <p className="text-text-secondary mb-6">Vous n&apos;avez pas encore passé de commande</p>
          <Link href="/products"><Button>Explorer les produits</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.orderNumber}`} className="block">
              <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-text-primary">#{order.orderNumber}</p>
                    <p className="text-sm text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                  </div>
                  <Badge variant={statusVariant[order.status]}>{statusLabel[order.status]}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-secondary">
                    {order.items.map((i) => i.product.nameFr || i.product.name).join(", ")}
                  </p>
                  <p className="font-bold text-primary-700">{formatDZD(order.totalAmount)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
