"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Eye,
  Download,
  BarChart3,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (!userData.user || (userData.user.role !== "seller" && userData.user.role !== "admin")) {
          router.push("/login");
          return;
        }
        setUser(userData.user);

        const [productsRes, ordersRes] = await Promise.all([
          fetch(`/api/products?sellerId=${userData.user.id}&limit=50`),
          fetch("/api/orders"),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        setProducts(productsData.products || []);
        setOrders(ordersData.orders || []);
      } catch {
        router.push("/login");
      }
      setLoading(false);
    };
    init();
  }, [router]);

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

  const totalRevenue = products.reduce(
    (sum, p) => sum + p.price * p.downloadCount,
    0
  );
  const totalDownloads = products.reduce((sum, p) => sum + p.downloadCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, {user?.name}
          </p>
        </div>
        <Link
          href="/dashboard/products?action=new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4" />
          Nouveau produit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
              <p className="text-sm text-gray-500">Produits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
              <p className="text-sm text-gray-500">Commandes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalDownloads}
              </p>
              <p className="text-sm text-gray-500">Téléchargements</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(totalRevenue)}
              </p>
              <p className="text-sm text-gray-500">Revenue estimé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Mes produits</h2>
          <Link
            href="/dashboard/products"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Gérer tout
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore de produits
            </p>
            <Link
              href="/dashboard/products?action=new"
              className="text-sm text-emerald-600 font-medium hover:underline"
            >
              Créer votre premier produit
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="p-4 flex items-center gap-4 hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.category.nameFr || product.category.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.downloadCount} ventes
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
