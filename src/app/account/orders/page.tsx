import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Download, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" | "secondary" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "في الانتظار", variant: "warning", icon: <Clock className="h-3 w-3" /> },
  paid: { label: "مدفوع", variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
  failed: { label: "فشل", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  refunded: { label: "مسترد", variant: "secondary", icon: <XCircle className="h-3 w-3" /> },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login?redirect=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
      downloads: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">طلباتي</h1>
        <Link href="/account" className="text-sm text-emerald-600 hover:underline">← حسابي</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات بعد</h3>
          <p className="text-gray-500 mb-4">ابدأ التسوق الآن!</p>
          <Link href="/products" className="text-emerald-600 font-medium hover:underline">
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">رقم الطلب</p>
                    <p className="font-mono font-bold text-gray-900 text-sm">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">التاريخ</p>
                    <p className="text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("ar-DZ")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">الإجمالي</p>
                    <p className="font-bold text-emerald-700 text-sm">
                      {formatPrice(order.total, order.currency)}
                    </p>
                  </div>
                  <Badge variant={status.variant} className="flex items-center gap-1">
                    {status.icon} {status.label}
                  </Badge>
                </div>

                {/* Items */}
                <div className="px-5 py-3 space-y-2">
                  {order.items.map((item) => {
                    const download = order.downloads.find((d) => d.productId === item.productId);
                    return (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                            📦
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.product.nameAr ?? item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">{formatPrice(item.price, item.currency)}</p>
                          </div>
                        </div>
                        {order.status === "paid" && download ? (
                          <Link
                            href={`/api/download/${download.token}`}
                            className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            تحميل ({download.downloadCount}/{download.maxDownloads})
                          </Link>
                        ) : order.status === "pending" ? (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> في انتظار التحقق
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {order.status === "pending" && (
                  <div className="px-5 pb-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                      ⚠️ طلبك قيد المراجعة. سيتم تفعيل التحميل بعد التحقق من الدفع.
                      {order.paymentMethod && ` طريقة الدفع: ${order.paymentMethod.toUpperCase()}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
