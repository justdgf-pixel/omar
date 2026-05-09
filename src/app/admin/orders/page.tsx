"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { formatPrice, cn } from "@/lib/utils";

const orders = [
  { id: "DS-2X8K-A1B2", customer: "Karim Benali", email: "karim@email.com", total: 8000, status: "completed", method: "CIB", date: "2026-05-09", items: 1 },
  { id: "DS-2X8L-C3D4", customer: "Amina Hadj", email: "amina@email.com", total: 2500, status: "processing", method: "Dahabia", date: "2026-05-09", items: 1 },
  { id: "DS-2X8M-E5F6", customer: "Youcef Kaci", email: "youcef@email.com", total: 15000, status: "pending", method: "BaridiMob", date: "2026-05-08", items: 1 },
  { id: "DS-2X8N-G7H8", customer: "Fatima Zohra", email: "fatima@email.com", total: 4500, status: "completed", method: "CIB", date: "2026-05-08", items: 2 },
  { id: "DS-2X8O-I9J0", customer: "Mohamed Saidi", email: "med@email.com", total: 1800, status: "completed", method: "CCP", date: "2026-05-07", items: 1 },
  { id: "DS-2X8P-K1L2", customer: "Nadia Bouzid", email: "nadia@email.com", total: 11500, status: "completed", method: "Dahabia", date: "2026-05-07", items: 3 },
  { id: "DS-2X8Q-M3N4", customer: "Ali Boudiaf", email: "ali@email.com", total: 7000, status: "cancelled", method: "BaridiMob", date: "2026-05-06", items: 1 },
  { id: "DS-2X8R-O5P6", customer: "Souad Merani", email: "souad@email.com", total: 3500, status: "completed", method: "CIB", date: "2026-05-06", items: 1 },
];

export default function AdminOrdersPage() {
  const { locale, t, isRTL } = useLocaleStore();

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
      <div className={cn("flex items-center gap-3 mb-8", isRTL && "flex-row-reverse")}>
        <Link
          href="/admin"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.admin.orders}
          </h1>
          <p className="text-gray-500 text-sm">
            {orders.length} {locale === "ar" ? "طلب" : "commande(s)"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "رقم الطلب" : "N° Commande"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "العميل" : "Client"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "المبلغ" : "Montant"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "طريقة الدفع" : "Paiement"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "العناصر" : "Articles"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "التاريخ" : "Date"}
                </th>
                <th className={cn("text-xs font-medium text-gray-400 uppercase px-4 py-3", isRTL ? "text-right" : "text-left")}>
                  {locale === "ar" ? "الحالة" : "Statut"}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 text-sm font-mono text-gray-600">
                    {order.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                    {formatPrice(order.total, locale)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {order.method}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {order.items}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-4 py-3.5">
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
    </div>
  );
}
