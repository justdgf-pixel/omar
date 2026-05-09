"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Check,
  X as XIcon,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmé" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (!userData.user || userData.user.role !== "admin") {
          router.push("/login");
          return;
        }

        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders"),
        ]);

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        setStats(statsData.stats);
        setRecentOrders(statsData.recentOrders || []);
        setOrders(ordersData.orders || []);
      } catch {
        router.push("/login");
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        toast.success("Statut mis à jour");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Administration
      </h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-gray-500">Utilisateurs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
                <p className="text-sm text-gray-500">Produits</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
                <p className="text-sm text-gray-500">Commandes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingOrders}
                </p>
                <p className="text-sm text-gray-500">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-sm text-gray-500">Revenus</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Management */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Gestion des commandes
          </h2>
          <div className="flex gap-2">
            {["", "pending", "confirmed", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filter === status
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {status === ""
                    ? "Tout"
                    : STATUS_OPTIONS.find((o) => o.value === status)?.label}
                </button>
              )
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune commande</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders
              .filter((o) => !filter || o.status === filter)
              .map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.user.name} ({order.user.email})
                        {order.user.phone && ` - ${order.user.phone}`}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.items.map((item: any) => (
                          <span
                            key={item.id}
                            className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded"
                          >
                            {item.product.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-emerald-600">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-400 uppercase">
                        {order.paymentMethod}
                        {order.paymentRef && ` - ${order.paymentRef}`}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
