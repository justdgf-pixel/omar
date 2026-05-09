"use client";

import { useEffect, useState } from "react";
import { formatDZD, PAYMENT_METHODS } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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
  createdAt: string;
  items: { product: { name: string; nameFr: string } }[];
}

const statusConfig: Record<string, { variant: "warning" | "info" | "success" | "danger"; label: string }> = {
  pending: { variant: "warning", label: "En attente" },
  confirmed: { variant: "info", label: "Confirmée" },
  completed: { variant: "success", label: "Terminée" },
  cancelled: { variant: "danger", label: "Annulée" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : "";
    fetch(`/api/orders${params}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Commandes</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "", label: "Toutes" },
          { value: "pending", label: "En attente" },
          { value: "confirmed", label: "Confirmées" },
          { value: "completed", label: "Terminées" },
          { value: "cancelled", label: "Annulées" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              filter === f.value ? "bg-primary-600 text-white" : "bg-white text-text-secondary border border-border hover:bg-surface-tertiary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-border bg-surface-secondary">
                <th className="p-4 font-medium">Commande</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Produits</th>
                <th className="p-4 font-medium">Paiement</th>
                <th className="p-4 font-medium">Montant</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="p-4"><div className="h-8 bg-surface-tertiary rounded-lg animate-pulse" /></td></tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-text-muted">Aucune commande</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-surface-secondary/50">
                    <td className="p-4">
                      <p className="font-medium text-text-primary">#{order.orderNumber}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-text-muted">{order.customerEmail}</p>
                      {order.customerPhone && <p className="text-xs text-text-muted">{order.customerPhone}</p>}
                      {order.customerWilaya && <p className="text-xs text-text-muted">{order.customerWilaya}</p>}
                    </td>
                    <td className="p-4 text-text-secondary max-w-48 truncate">
                      {order.items.map((i) => i.product.nameFr || i.product.name).join(", ")}
                    </td>
                    <td className="p-4">
                      <span className="text-xs bg-surface-tertiary px-2 py-1 rounded-lg">
                        {PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label || order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-primary-700">{formatDZD(order.totalAmount)}</td>
                    <td className="p-4">
                      <Badge variant={statusConfig[order.status]?.variant || "default"}>
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {order.status === "pending" && (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => updateStatus(order.id, "confirmed")}>
                              Confirmer
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => updateStatus(order.id, "cancelled")}>
                              Annuler
                            </Button>
                          </>
                        )}
                        {order.status === "confirmed" && (
                          <Button size="sm" variant="secondary" onClick={() => updateStatus(order.id, "completed")}>
                            Terminer
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
