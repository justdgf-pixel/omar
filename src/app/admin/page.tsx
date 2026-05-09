import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const [
    totalProducts,
    publishedProducts,
    totalOrders,
    pendingOrders,
    paidOrders,
    totalUsers,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.user.count(),
    prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameAr: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    where: { status: "paid" },
    _sum: { total: true },
  });

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-1">مرحباً {session.user.name} 👋</p>
        </div>
        <Link href="/admin/products/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
          + إضافة منتج
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "إجمالي الإيرادات",
            value: formatPrice(revenue._sum.total ?? 0, "DZD"),
            sub: `${paidOrders} طلب مدفوع`,
            icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
            bg: "bg-emerald-50",
          },
          {
            label: "إجمالي الطلبات",
            value: totalOrders,
            sub: `${pendingOrders} في الانتظار`,
            icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
            bg: "bg-blue-50",
          },
          {
            label: "المنتجات",
            value: publishedProducts,
            sub: `${totalProducts} إجمالي`,
            icon: <Package className="h-6 w-6 text-purple-600" />,
            bg: "bg-purple-50",
          },
          {
            label: "المستخدمون",
            value: totalUsers,
            sub: "عميل مسجل",
            icon: <Users className="h-6 w-6 text-orange-600" />,
            bg: "bg-orange-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2.5 rounded-lg ${stat.bg} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: "/admin/products", label: "إدارة المنتجات", icon: <Package className="h-5 w-5" /> },
          { href: "/admin/orders", label: "إدارة الطلبات", icon: <ShoppingBag className="h-5 w-5" /> },
          { href: "/admin/orders?status=pending", label: "طلبات معلقة", icon: <Clock className="h-5 w-5" />, badge: pendingOrders },
          { href: "/admin/analytics", label: "الإحصائيات", icon: <TrendingUp className="h-5 w-5" /> },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-sm font-medium text-gray-700"
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-emerald-600 hover:underline">عرض الكل</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {order.user.name ?? order.user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {order.items.map((i) => i.product.nameAr ?? i.product.name).join(", ")}
                </p>
              </div>
              <div className="text-sm font-bold text-emerald-700 shrink-0">
                {formatPrice(order.total, order.currency)}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                {order.status === "pending" ? "معلق" : order.status === "paid" ? "مدفوع" : order.status === "failed" ? "فشل" : "مسترد"}
              </span>
              <Link href="/admin/orders" className="text-xs text-emerald-600 hover:underline shrink-0">
                معالجة
              </Link>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              لا توجد طلبات بعد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
