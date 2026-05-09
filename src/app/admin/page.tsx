"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Eye,
} from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { products } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";

const recentOrders = [
  { id: "DS-2X8K-A1B2", customer: "Karim Benali", total: 8000, status: "completed", date: "2026-05-09" },
  { id: "DS-2X8L-C3D4", customer: "Amina Hadj", total: 2500, status: "processing", date: "2026-05-09" },
  { id: "DS-2X8M-E5F6", customer: "Youcef Kaci", total: 15000, status: "pending", date: "2026-05-08" },
  { id: "DS-2X8N-G7H8", customer: "Fatima Zohra", total: 4500, status: "completed", date: "2026-05-08" },
  { id: "DS-2X8O-I9J0", customer: "Mohamed Saidi", total: 1800, status: "completed", date: "2026-05-07" },
];

export default function AdminPage() {
  const { locale, t, isRTL } = useLocaleStore();

  const stats = [
    {
      label: t.admin.totalRevenue,
      value: formatPrice(2450000, locale),
      change: "+12%",
      icon: <DollarSign size={22} />,
      color: "emerald",
    },
    {
      label: t.admin.todayOrders,
      value: "23",
      change: "+5%",
      icon: <ShoppingBag size={22} />,
      color: "blue",
    },
    {
      label: t.admin.totalProducts,
      value: String(products.length),
      change: "+2",
      icon: <Package size={22} />,
      color: "purple",
    },
    {
      label: t.admin.totalCustomers,
      value: "1,247",
      change: "+18%",
      icon: <Users size={22} />,
      color: "amber",
    },
  ];

  const statusColors: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, Record<string, string>> = {
    completed: { fr: "Terminé", ar: "مكتمل" },
    processing: { fr: "En cours", ar: "قيد المعالجة" },
    pending: { fr: "En attente", ar: "قيد الانتظار" },
    cancelled: { fr: "Annulé", ar: "ملغى" },
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.admin.title}</h1>
          <p className="text-gray-500 mt-1">
            {locale === "ar"
              ? "مرحبًا، هذا ملخص نشاطك"
              : "Bienvenue, voici un résumé de votre activité"}
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all text-sm flex items-center gap-2"
        >
          <Package size={16} />
          {t.admin.addProduct}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className={cn("flex items-center justify-between mb-3", isRTL && "flex-row-reverse")}>
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center",
                  stat.color === "emerald" && "bg-emerald-100 text-emerald-600",
                  stat.color === "blue" && "bg-blue-100 text-blue-600",
                  stat.color === "purple" && "bg-purple-100 text-purple-600",
                  stat.color === "amber" && "bg-amber-100 text-amber-600"
                )}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <TrendingUp size={12} />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className={cn("flex items-center justify-between mb-5", isRTL && "flex-row-reverse")}>
            <h2 className="text-lg font-semibold text-gray-900">
              {locale === "ar" ? "الطلبات الأخيرة" : "Commandes récentes"}
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              {t.common.viewAll}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className={cn("text-xs font-medium text-gray-400 uppercase pb-3", isRTL ? "text-right" : "text-left")}>
                    {locale === "ar" ? "رقم الطلب" : "Commande"}
                  </th>
                  <th className={cn("text-xs font-medium text-gray-400 uppercase pb-3", isRTL ? "text-right" : "text-left")}>
                    {locale === "ar" ? "العميل" : "Client"}
                  </th>
                  <th className={cn("text-xs font-medium text-gray-400 uppercase pb-3", isRTL ? "text-right" : "text-left")}>
                    {locale === "ar" ? "المبلغ" : "Montant"}
                  </th>
                  <th className={cn("text-xs font-medium text-gray-400 uppercase pb-3", isRTL ? "text-right" : "text-left")}>
                    {locale === "ar" ? "الحالة" : "Statut"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3.5 text-sm font-mono text-gray-600">
                      {order.id}
                    </td>
                    <td className="py-3.5 text-sm text-gray-900 font-medium">
                      {order.customer}
                    </td>
                    <td className="py-3.5 text-sm font-semibold text-gray-900">
                      {formatPrice(order.total, locale)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-lg",
                          statusColors[order.status]
                        )}
                      >
                        {statusLabels[order.status]?.[locale] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {locale === "ar" ? "المنتجات الأكثر مبيعًا" : "Produits populaires"}
          </h2>
          <div className="space-y-4">
            {products
              .sort((a, b) => b.downloadCount - a.downloadCount)
              .slice(0, 5)
              .map((product, i) => {
                const name = locale === "ar" ? product.nameAr : product.name;
                return (
                  <div
                    key={product.id}
                    className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}
                  >
                    <span className="text-sm font-bold text-gray-300 w-5">
                      {i + 1}
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">
                        {product.category === "ebooks"
                          ? "📚"
                          : product.category === "courses"
                          ? "🎓"
                          : product.category === "templates"
                          ? "📄"
                          : product.category === "software"
                          ? "💻"
                          : product.category === "graphics"
                          ? "🎨"
                          : product.category === "music"
                          ? "🎵"
                          : "📷"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.downloadCount.toLocaleString()}{" "}
                        {t.products.downloads}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {formatPrice(product.price, locale)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
