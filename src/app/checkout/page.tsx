"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, WILAYAS, PAYMENT_METHODS } from "@/lib/utils";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "info" | "payment" | "confirm";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: session?.user.name ?? "",
    email: session?.user.email ?? "",
    wilaya: "",
    paymentMethod: "",
    paymentRef: "",
    notes: "",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === form.paymentMethod);

  const handleSubmit = async () => {
    if (!session) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      toast({ title: "السلة فارغة", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let receiptImageUrl: string | null = null;
      if (receiptFile) {
        const formData = new FormData();
        formData.append("file", receiptFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          receiptImageUrl = uploadData.url;
        }
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, price: i.price })),
          total,
          paymentMethod: form.paymentMethod,
          paymentRef: form.paymentRef,
          receiptImageUrl,
          wilaya: form.wilaya,
          notes: form.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "حدث خطأ");

      setOrderId(data.id);
      clearCart();
      setStep("confirm");
    } catch (err) {
      toast({
        title: "حدث خطأ",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
        <Link href="/products">
          <Button>تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  if (step === "confirm" && orderId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام طلبك!</h2>
          <p className="text-gray-600 mb-2">رقم الطلب: <span className="font-mono font-bold text-emerald-700">#{orderId.slice(-8).toUpperCase()}</span></p>
          <p className="text-gray-500 text-sm mb-6">
            سيتم مراجعة طلبك والتحقق من الدفع. ستتلقى إشعاراً عند تفعيل تحميل منتجاتك.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-right">
            <p className="text-yellow-800 text-sm font-medium mb-1">⚠️ ملاحظة مهمة</p>
            <p className="text-yellow-700 text-xs">
              إذا لم تكن قد أرسلت صورة الإيصال، يرجى التواصل معنا عبر الواتساب مع ذكر رقم الطلب أعلاه.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/account/orders">
              <Button className="w-full">عرض طلباتي</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full">مواصلة التسوق</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إتمام الشراء</h1>

      {/* Auth Check */}
      {!session && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">يجب تسجيل الدخول للمتابعة</p>
            <Link href="/login?redirect=/checkout" className="text-xs text-yellow-700 underline">
              سجل الدخول أو أنشئ حساباً مجاناً
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Steps */}
          <div className="flex items-center gap-2 text-sm mb-2">
            {[
              { id: "info", label: "1. البيانات" },
              { id: "payment", label: "2. الدفع" },
            ].map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => step !== "confirm" && setStep(s.id as Step)}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-medium transition-colors",
                    step === s.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {s.label}
                </button>
                {i === 0 && <span className="text-gray-300">→</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Info */}
          {step === "info" && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">بيانات التواصل</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">الاسم الكامل</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">الولاية</label>
                <Select value={form.wilaya} onValueChange={(v) => setForm({ ...form, wilaya: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر ولايتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {WILAYAS.map((w) => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (!form.name || !form.email) {
                    toast({ title: "يرجى ملء جميع الحقول", variant: "destructive" });
                    return;
                  }
                  if (!session) {
                    router.push("/login?redirect=/checkout");
                    return;
                  }
                  setStep("payment");
                }}
              >
                التالي: اختيار طريقة الدفع →
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">اختر طريقة الدفع</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setForm({ ...form, paymentMethod: method.id })}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all",
                        form.paymentMethod === method.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Instructions */}
              {selectedPayment && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    تعليمات الدفع بـ {selectedPayment.name}
                  </h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    {form.paymentMethod === "cib" && (
                      <>
                        <p>1. افتح تطبيق CIB أو اذهب إلى موقع بنكك</p>
                        <p>2. قم بتحويل المبلغ <strong>{formatPrice(total, "DZD")}</strong> إلى الحساب:</p>
                        <p className="font-mono bg-blue-100 px-3 py-1.5 rounded text-sm">RIB: 0000 0000 0000 0000 0000 (مثال)</p>
                        <p>3. التقط صورة لإيصال التحويل وارفعها أدناه</p>
                      </>
                    )}
                    {form.paymentMethod === "baridimob" && (
                      <>
                        <p>1. افتح تطبيق بريدي موب</p>
                        <p>2. اختر "تحويل الأموال" ثم أرسل <strong>{formatPrice(total, "DZD")}</strong> إلى:</p>
                        <p className="font-mono bg-blue-100 px-3 py-1.5 rounded text-sm">CCP: 000000000 - Clé: 00</p>
                        <p>3. أرسل لقطة شاشة الإيصال</p>
                      </>
                    )}
                    {form.paymentMethod === "baridipay" && (
                      <>
                        <p>1. ادفع عبر بريدي باي بالمبلغ <strong>{formatPrice(total, "DZD")}</strong></p>
                        <p>2. الرقم المرجعي: <span className="font-mono">RAKAM-{Date.now().toString().slice(-6)}</span></p>
                        <p>3. ارفع إيصال الدفع</p>
                      </>
                    )}
                    {form.paymentMethod === "dahabiya" && (
                      <>
                        <p>1. استخدم بطاقة الذهبية للدفع بمبلغ <strong>{formatPrice(total, "DZD")}</strong></p>
                        <p>2. رقم الحساب: CCP 000000000 / Clé: 00</p>
                        <p>3. ارفع إيصال العملية</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Receipt */}
              {form.paymentMethod && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900">إرفاق إيصال الدفع</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">رقم المرجع / المعاملة (اختياري)</label>
                      <Input
                        value={form.paymentRef}
                        onChange={(e) => setForm({ ...form, paymentRef: e.target.value })}
                        placeholder="أدخل رقم مرجع الدفع"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">صورة الإيصال</label>
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {receiptFile ? receiptFile.name : "انقر لرفع صورة الإيصال"}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                      {receiptPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={receiptPreview} alt="receipt" className="mt-2 h-32 w-auto rounded-lg border" />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">ملاحظات (اختياري)</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="أي ملاحظات إضافية..."
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading || !form.paymentMethod}
                  >
                    {loading ? "جار إرسال الطلب..." : "تأكيد الطلب ✓"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">ملخص الطلب</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate ml-2">{item.name}</span>
                  <span className="text-gray-900 shrink-0">{formatPrice(item.price, item.currency)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-bold">
                <span>المجموع الكلي</span>
                <span className="text-emerald-700 text-lg">{formatPrice(total, "DZD")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
