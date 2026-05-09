import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Download, User, ChevronRight } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login?redirect=/account");

  const [orders, downloads] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.download.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">حسابي</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold">
            {session.user.name?.[0] ?? "م"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{session.user.name ?? "المستخدم"}</h2>
            <p className="text-gray-500 text-sm">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "إجمالي الطلبات", value: orders, icon: <Package className="h-6 w-6 text-emerald-600" /> },
          { label: "المنتجات المحملة", value: downloads, icon: <Download className="h-6 w-6 text-blue-600" /> },
          { label: "نوع الحساب", value: session.user.role === "admin" ? "مدير" : "عميل", icon: <User className="h-6 w-6 text-purple-600" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="p-2.5 bg-gray-50 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {[
          { href: "/account/orders", label: "طلباتي وتحميلاتي", icon: <Package className="h-5 w-5 text-gray-400" /> },
          { href: "/products", label: "تصفح المنتجات", icon: <ChevronRight className="h-5 w-5 text-gray-400" /> },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
