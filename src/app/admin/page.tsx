"use client";

import { useEffect, useState } from "react";
import { formatDZD } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string };
    items: { product: { name: string } }[];
  }[];
  topProducts: { name: string; salesCount: number; price: number }[];
}

const statusConfig: Record<string, { variant: "warning" | "info" | "success" | "danger"; label: string }> = {
  pending: { variant: "warning", label: "En attente" },
  confirmed: { variant: "info", label: "Confirmée" },
  completed: { variant: "success", label: "Terminée" },
  cancelled: { variant: "danger", label: "Annulée" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-6">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Revenus total", value: formatDZD(stats.totalRevenue), icon: "💰", color: "bg-green-50 text-green-700" },
    { label: "Commandes", value: stats.totalOrders.toString(), icon: "📋", color: "bg-blue-50 text-blue-700" },
    { label: "En attente", value: stats.pendingOrders.toString(), icon: "⏳", color: "bg-yellow-50 text-yellow-700" },
    { label: "Utilisateurs", value: stats.totalUsers.toString(), icon: "👥", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Tableau de bord</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${card.color}`}>
                {card.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{card.value}</p>
            <p className="text-sm text-text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-text-primary mb-4">Commandes récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-border">
                  <th className="pb-3 font-medium">Commande</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Montant</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <a href={`/admin/orders`} className="font-medium text-primary-600 hover:underline">
                        #{order.orderNumber}
                      </a>
                    </td>
                    <td className="py-3 text-text-secondary">{order.user.name}</td>
                    <td className="py-3 font-medium">{formatDZD(order.totalAmount)}</td>
                    <td className="py-3">
                      <Badge variant={statusConfig[order.status]?.variant || "default"}>
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">Aucune commande</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-text-primary mb-4">Meilleurs produits</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-surface-tertiary rounded-lg flex items-center justify-center text-sm font-bold text-text-muted">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.salesCount} ventes</p>
                </div>
                <span className="text-sm font-medium text-primary-700">{formatDZD(product.price)}</span>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-center text-text-muted text-sm py-4">Aucune vente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
