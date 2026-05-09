"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice, PAYMENT_METHODS } from "@/lib/utils";
import { ArrowLeft, Check, ShieldCheck, AlertCircle, Copy } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => { setMounted(true); const stored = localStorage.getItem("digidz-user"); if (stored) { try { setUser(JSON.parse(stored)); } catch {} } }, []);

  if (!mounted) return null;
  if (items.length === 0 && !orderId) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">Nothing to checkout</h2><Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">Browse Products</Link></div></div>;
  if (!user) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center max-w-md"><AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h2><p className="text-gray-500 mb-6">Please sign in to complete your purchase</p><Link href="/auth/signin" className="inline-flex px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl">Sign In</Link></div></div>;

  const handlePlaceOrder = async () => {
    if (!selectedPayment) { setError("Please select a payment method"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ buyerId: user.id, items: items.map((item) => ({ productId: item.id, price: item.price })), paymentMethod: selectedPayment, paymentRef: paymentRef || undefined, totalAmount: totalPrice() }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to place order"); setLoading(false); return; }
      setOrderId(data.order.id); setStep(3); clearCart();
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  if (step === 3) return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-emerald-600" /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-4">Your order has been received. You&apos;ll get access to your downloads once the payment is confirmed.</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-sm text-gray-500">Order ID</p><div className="flex items-center justify-center gap-2 mt-1"><code className="text-sm font-mono text-gray-900">{orderId.substring(0, 8)}...</code><button onClick={() => navigator.clipboard.writeText(orderId)} className="text-gray-400 hover:text-gray-600"><Copy className="w-4 h-4" /></button></div></div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/buyer" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl">View My Orders</Link>
          <Link href="/products" className="px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-xl">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Cart</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 text-emerald-600"><span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">1</span><span className="text-sm font-medium">Payment</span></div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-emerald-600" : "text-gray-400"}`}><span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}>2</span><span className="text-sm font-medium">Confirm</span></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Payment Method</h2>
                {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button key={method.id} onClick={() => setSelectedPayment(method.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedPayment === method.id ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-gray-200"}`}>
                      <span className="text-2xl">{method.icon}</span><div><p className="font-medium text-gray-900">{method.name}</p><p className="text-sm text-gray-500">{method.nameFr}</p></div>
                      {selectedPayment === method.id && <Check className="w-5 h-5 text-emerald-600 ml-auto" />}
                    </button>
                  ))}
                </div>
                {selectedPayment && (
                  <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <h3 className="font-medium text-amber-800 mb-2 text-sm">Payment Instructions</h3>
                    {selectedPayment === "ccp" && <div className="text-sm text-amber-700 space-y-1"><p>Transfer the total amount to:</p><p className="font-mono font-bold">CCP: 00799999 00 99</p><p className="font-bold">Name: DigiDZ SARL</p><p className="mt-2">Include your order reference in the transfer notes.</p></div>}
                    {selectedPayment === "baridimob" && <div className="text-sm text-amber-700 space-y-1"><p>Send payment via BaridiMob to:</p><p className="font-mono font-bold">RIP: 00799999 0000000099 99</p><p className="mt-2">Send a screenshot of the confirmation as payment reference.</p></div>}
                    {selectedPayment === "edahabia" && <div className="text-sm text-amber-700 space-y-1"><p>Pay with your Edahabia card through the secure gateway.</p><p className="mt-2">You will be redirected after confirming your order.</p></div>}
                  </div>
                )}
                {selectedPayment && selectedPayment !== "edahabia" && (
                  <div className="mt-4"><label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Reference / Transaction ID (optional)</label><input type="text" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Enter your transaction reference" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div>
                )}
                <button onClick={() => setStep(2)} disabled={!selectedPayment} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors">Continue to Review</button>
              </div>
            )}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
                <div className="space-y-3 mb-6">{items.map((item) => (<div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">📦</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{item.title}</p></div><p className="font-medium text-gray-900">{formatPrice(item.price)}</p></div>))}</div>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Payment Method</span><span className="font-medium text-gray-900">{PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name || selectedPayment}</span></div>
                  {paymentRef && <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Reference</span><span className="font-medium text-gray-900">{paymentRef}</span></div>}
                  <hr className="my-2" /><div className="flex justify-between font-bold text-gray-900"><span>Total</span><span>{formatPrice(totalPrice())}</span></div>
                </div>
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6"><ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" /><p className="text-sm text-emerald-700">Your payment information is secure. You&apos;ll get instant access to your digital products once the payment is confirmed.</p></div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-colors">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors">{loading ? "Processing..." : "Place Order"}</button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">{items.map((item) => (<div key={item.id} className="flex justify-between text-gray-600"><span className="truncate pr-2">{item.title}</span><span className="flex-shrink-0">{formatPrice(item.price)}</span></div>))}</div>
              <hr className="my-3" /><div className="flex justify-between font-bold text-gray-900"><span>Total</span><span>{formatPrice(totalPrice())}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
