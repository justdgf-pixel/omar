import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderActions from "./OrderActions";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  pending: "معلق",
  paid: "مدفوع",
  failed: "فشل",
  refunded: "مسترد",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const params = await searchParams;
  const where = params.status ? { status: params.status } : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { select: { name: true, nameAr: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
        <Link href="/admin" className="text-sm text-emerald-600 hover:underline">← لوحة التحكم</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { value: "", label: "الكل" },
          { value: "pending", label: "معلقة" },
          { value: "paid", label: "مدفوعة" },
          { value: "failed", label: "فشل" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/orders?status=${f.value}` : "/admin/orders"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (params.status ?? "") === f.value
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:border-emerald-300"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">رقم الطلب</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">العميل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">المنتجات</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">الإجمالي</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">الدفع</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">التاريخ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-700">
                    #{order.id.slice(-8).toUpperCase()}
                    {order.receiptImageUrl && (
                      <a href={order.receiptImageUrl} target="_blank" rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline mt-0.5">📎 إيصال</a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                    {order.user.phone && <p className="text-xs text-gray-400">{order.user.phone}</p>}
                    {order.wilaya && <p className="text-xs text-emerald-600">{order.wilaya}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-xs text-gray-600 truncate max-w-[150px]">
                          • {item.product.nameAr ?? item.product.name}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 uppercase font-medium">
                      {order.paymentMethod ?? "-"}
                    </span>
                    {order.paymentRef && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{order.paymentRef}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("ar-DZ")}
                    <br />
                    {new Date(order.createdAt).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <OrderActions orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">لا توجد طلبات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
