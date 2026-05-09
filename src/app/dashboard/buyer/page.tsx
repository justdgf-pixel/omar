"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Download, ShoppingCart, Clock, Check } from "lucide-react";

interface Order {
  id: string; totalAmount: number; status: string; paymentMethod: string; createdAt: string;
  items: { id: string; price: number; downloaded: boolean; product: { id: string; title: string; images: string; fileUrl: string; seller: { name: string; id: string } } }[];
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "downloads">("orders");

  useEffect(() => {
    const stored = localStorage.getItem("digidz-user");
    if (!stored) { router.push("/auth/signin"); return; }
    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetch(`/api/orders?buyerId=${parsed.id}`).then((r) => r.json()).then((data) => { setOrders(data.orders || []); setLoading(false); });
    } catch { router.push("/auth/signin"); }
  }, [router]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse space-y-6"><div className="h-8 bg-gray-100 rounded w-1/4" /><div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-2xl" />))}</div></div></div>;
  if (!user) return null;

  const allItems = orders.flatMap((o) => o.items.map((item) => ({ ...item, orderStatus: o.status })));
  const downloadableItems = allItems.filter((item) => item.orderStatus === "completed");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold text-gray-900">My Account</h1><p className="text-gray-500 mt-1">Welcome back, {user.name}</p></div>
          <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"><ShoppingCart className="w-4 h-4" /> Browse Products</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-500">Total Orders</p><p className="text-xl font-bold text-gray-900">{orders.length}</p></div></div></div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><Download className="w-5 h-5 text-emerald-600" /></div><div><p className="text-sm text-gray-500">Downloads Available</p><p className="text-xl font-bold text-gray-900">{downloadableItems.length}</p></div></div></div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div><div><p className="text-sm text-gray-500">Pending Orders</p><p className="text-xl font-bold text-gray-900">{orders.filter((o) => o.status === "pending").length}</p></div></div></div>
        </div>
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-6 w-fit">
          {(["orders", "downloads"] as const).map((t) => (<button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}>{t === "orders" ? "My Orders" : "My Downloads"}</button>))}
        </div>
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center"><Package className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3><Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">Browse Products</Link></div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div><p className="text-xs text-gray-500">Order</p><p className="text-sm font-mono text-gray-700">#{order.id.substring(0, 8)}</p></div>
                    <div><p className="text-xs text-gray-500">Date</p><p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p></div>
                    <div><p className="text-xs text-gray-500">Payment</p><p className="text-sm text-gray-700">{order.paymentMethod.toUpperCase()}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${order.status === "completed" ? "bg-emerald-100 text-emerald-700" : order.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{order.status === "completed" && <Check className="w-3 h-3 inline mr-1" />}{order.status === "pending" && <Clock className="w-3 h-3 inline mr-1" />}{order.status}</span>
                    <span className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">{order.items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📦</div>
                    <div className="flex-1 min-w-0"><Link href={`/products/${item.product.id}`} className="text-sm font-medium text-gray-900 hover:text-emerald-700">{item.product.title}</Link><p className="text-xs text-gray-500">by {item.product.seller.name}</p></div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                    {order.status === "completed" && <button className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"><Download className="w-4 h-4" /> Download</button>}
                  </div>
                ))}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "downloads" && (
          <div className="bg-white rounded-2xl border border-gray-100">
            {downloadableItems.length === 0 ? (
              <div className="p-12 text-center"><Download className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">No downloads available</h3><p className="text-gray-500">Your purchases will appear here once payment is confirmed</p></div>
            ) : (
              <div className="divide-y divide-gray-50">{downloadableItems.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">📦</div>
                  <div className="flex-1 min-w-0"><Link href={`/products/${item.product.id}`} className="text-sm font-medium text-gray-900 hover:text-emerald-700">{item.product.title}</Link><p className="text-xs text-gray-500">by {item.product.seller.name}</p></div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"><Download className="w-4 h-4" /> Download</button>
                </div>
              ))}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
