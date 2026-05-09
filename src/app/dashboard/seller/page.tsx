"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, DollarSign, Download, TrendingUp, Plus, Eye, X } from "lucide-react";

interface Product { id: string; title: string; price: number; status: string; downloads: number; rating: number; reviewCount: number; createdAt: string; category: { name: string; slug: string } }
interface Order { id: string; totalAmount: number; status: string; paymentMethod: string; createdAt: string; buyer: { name: string; email: string }; items: { price: number; product: { title: string } }[] }

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [categories, setCategoriesState] = useState<{ id: string; name: string }[]>([]);
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", comparePrice: "", categoryId: "", fileUrl: "/files/digital-product.zip", fileSize: "", fileType: "" });
  const [addingProduct, setAddingProduct] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("digidz-user");
    if (!stored) { router.push("/auth/signin"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "seller") { router.push("/dashboard/buyer"); return; }
      setUser(parsed);
      Promise.all([
        fetch(`/api/products?sellerId=${parsed.id}&limit=100`).then((r) => r.json()),
        fetch(`/api/orders?sellerId=${parsed.id}`).then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()).catch(() => ({ categories: [] })),
      ]).then(([pd, od, cd]) => { setProducts(pd.products || []); setOrders(od.orders || []); setCategoriesState(cd.categories || []); setLoading(false); });
    } catch { router.push("/auth/signin"); }
  }, [router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setAddError(""); setAddingProduct(true);
    try {
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: newProduct.title, description: newProduct.description, price: parseFloat(newProduct.price), comparePrice: newProduct.comparePrice ? parseFloat(newProduct.comparePrice) : undefined, categoryId: newProduct.categoryId, sellerId: user!.id, fileUrl: newProduct.fileUrl, fileSize: newProduct.fileSize || undefined, fileType: newProduct.fileType || undefined }) });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error || "Failed to add product"); } else { setProducts([data.product, ...products]); setShowAddProduct(false); setNewProduct({ title: "", description: "", price: "", comparePrice: "", categoryId: "", fileUrl: "/files/digital-product.zip", fileSize: "", fileType: "" }); }
    } catch { setAddError("Something went wrong"); }
    setAddingProduct(false);
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse space-y-6"><div className="h-8 bg-gray-100 rounded w-1/4" /><div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-2xl" />))}</div></div></div>;
  if (!user) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDownloads = products.reduce((sum, p) => sum + p.downloads, 0);
  const activeProducts = products.filter((p) => p.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1><p className="text-gray-500 mt-1">Welcome back, {user.name}</p></div>
          <button onClick={() => setShowAddProduct(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Product</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: DollarSign, label: "Total Revenue", value: formatPrice(totalRevenue), color: "emerald" },
            { icon: Package, label: "Active Products", value: String(activeProducts), color: "blue" },
            { icon: Download, label: "Total Downloads", value: String(totalDownloads), color: "purple" },
            { icon: TrendingUp, label: "Total Orders", value: String(orders.length), color: "amber" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}><Icon className={`w-5 h-5 text-${color}-600`} /></div>
                <div><p className="text-sm text-gray-500">{label}</p><p className="text-xl font-bold text-gray-900">{value}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-6 w-fit">
          {(["overview", "products", "orders"] as const).map((t) => (<button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>))}
        </div>
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Products</h3>
              {products.length === 0 ? <div className="text-center py-8"><p className="text-gray-500 text-sm">No products yet</p></div> :
                <div className="space-y-3">{products.slice(0, 5).map((p) => (<div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{p.title}</p><p className="text-xs text-gray-500">{p.category.name} &bull; {p.downloads} downloads</p></div><p className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</p></div>))}</div>}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
              {orders.length === 0 ? <div className="text-center py-8"><p className="text-gray-500 text-sm">No orders yet</p></div> :
                <div className="space-y-3">{orders.slice(0, 5).map((o) => (<div key={o.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900">{o.buyer.name}</p><p className="text-xs text-gray-500">{formatDate(o.createdAt)} &bull; {o.paymentMethod.toUpperCase()}</p></div><div className="text-right"><p className="text-sm font-bold text-gray-900">{formatPrice(o.totalAmount)}</p><span className={`text-xs px-2 py-0.5 rounded-full ${o.status === "completed" ? "bg-emerald-100 text-emerald-700" : o.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}>{o.status}</span></div></div>))}</div>}
            </div>
          </div>
        )}
        {tab === "products" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Product</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Category</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Price</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Downloads</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody>{products.map((p) => (<tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-5"><p className="text-sm font-medium text-gray-900 max-w-xs truncate">{p.title}</p></td><td className="py-3 px-5 text-sm text-gray-600">{p.category.name}</td><td className="py-3 px-5 text-sm font-medium text-gray-900">{formatPrice(p.price)}</td><td className="py-3 px-5 text-sm text-gray-600">{p.downloads}</td><td className="py-3 px-5"><span className={`text-xs px-2.5 py-1 rounded-full ${p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span></td><td className="py-3 px-5"><Link href={`/products/${p.id}`} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 inline-flex"><Eye className="w-4 h-4" /></Link></td></tr>))}</tbody></table></div></div>
        )}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {orders.length === 0 ? <div className="text-center py-12"><p className="text-gray-500">No orders yet</p></div> :
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Order</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Buyer</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Amount</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Payment</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Date</th></tr></thead>
                <tbody>{orders.map((o) => (<tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-5 text-sm font-mono text-gray-600">#{o.id.substring(0, 8)}</td><td className="py-3 px-5"><p className="text-sm font-medium text-gray-900">{o.buyer.name}</p><p className="text-xs text-gray-500">{o.buyer.email}</p></td><td className="py-3 px-5 text-sm font-medium text-gray-900">{formatPrice(o.totalAmount)}</td><td className="py-3 px-5 text-sm text-gray-600">{o.paymentMethod.toUpperCase()}</td><td className="py-3 px-5"><span className={`text-xs px-2.5 py-1 rounded-full ${o.status === "completed" ? "bg-emerald-100 text-emerald-700" : o.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{o.status}</span></td><td className="py-3 px-5 text-sm text-gray-600">{formatDate(o.createdAt)}</td></tr>))}</tbody></table></div>}
          </div>
        )}
      </div>
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-900">Add New Product</h2><button onClick={() => setShowAddProduct(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button></div>
            {addError && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{addError}</div>}
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={newProduct.title} onChange={(e) => setNewProduct((p) => ({ ...p, title: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} required rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={newProduct.categoryId} onChange={(e) => setNewProduct((p) => ({ ...p, categoryId: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white"><option value="">Select a category</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (DZD)</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label><input type="number" value={newProduct.comparePrice} onChange={(e) => setNewProduct((p) => ({ ...p, comparePrice: e.target.value }))} min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">File Size</label><input type="text" value={newProduct.fileSize} onChange={(e) => setNewProduct((p) => ({ ...p, fileSize: e.target.value }))} placeholder="e.g. 15 MB" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">File Type</label><input type="text" value={newProduct.fileType} onChange={(e) => setNewProduct((p) => ({ ...p, fileType: e.target.value }))} placeholder="e.g. PDF, ZIP" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
              </div>
              <button type="submit" disabled={addingProduct} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors">{addingProduct ? "Adding..." : "Add Product"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
