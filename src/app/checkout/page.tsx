"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Wallet,
  Smartphone,
  Building,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLocaleStore } from "@/store/locale";
import { PaymentMethod, WILAYAS } from "@/types";
import { formatPrice, generateOrderId, cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { locale, t, isRTL } = useLocaleStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    wilaya: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cib");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = getTotal();

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.email.trim() || !formData.email.includes("@"))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (!formData.wilaya) newErrors.wilaya = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = generateOrderId();
    clearCart();
    router.push(`/checkout/success?order=${orderId}`);
  };

  const paymentMethods: {
    id: PaymentMethod;
    label: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
  }[] = [
    {
      id: "cib",
      label: t.checkout.paymentMethods.cib,
      icon: <CreditCard size={22} />,
      color: "blue",
      desc: locale === "ar" ? "ادفع ببطاقة CIB البنكية" : "Payez avec votre carte bancaire CIB",
    },
    {
      id: "dahabia",
      label: t.checkout.paymentMethods.dahabia,
      icon: <Wallet size={22} />,
      color: "amber",
      desc: locale === "ar" ? "ادفع ببطاقة الذهبية" : "Payez avec votre carte Edahabia",
    },
    {
      id: "baridimob",
      label: t.checkout.paymentMethods.baridimob,
      icon: <Smartphone size={22} />,
      color: "yellow",
      desc: locale === "ar" ? "ادفع عبر تطبيق بريدي موب" : "Payez via l'application BaridiMob",
    },
    {
      id: "ccp",
      label: t.checkout.paymentMethods.ccp,
      icon: <Building size={22} />,
      color: "emerald",
      desc: locale === "ar" ? "حوالة بريدية أو تحويل CCP" : "Mandat ou virement postal CCP",
    },
  ];

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t.checkout.title}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                {t.checkout.personalInfo}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.checkout.fullName}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm",
                      errors.fullName
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-emerald-400"
                    )}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.checkout.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm",
                      errors.email
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-emerald-400"
                    )}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0555 XX XX XX"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm",
                      errors.phone
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-emerald-400"
                    )}
                    dir="ltr"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t.checkout.wilaya}
                  </label>
                  <select
                    value={formData.wilaya}
                    onChange={(e) =>
                      setFormData({ ...formData, wilaya: e.target.value })
                    }
                    className={cn(
                      "w-full appearance-none px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm cursor-pointer",
                      errors.wilaya
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-emerald-400"
                    )}
                  >
                    <option value="">{t.checkout.selectWilaya}</option>
                    {WILAYAS.map((w, i) => (
                      <option key={w} value={w}>
                        {String(i + 1).padStart(2, "0")} - {w}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "absolute bottom-3 text-gray-400 pointer-events-none",
                      isRTL ? "left-3" : "right-3"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                {t.checkout.paymentMethod}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                      isRTL && "flex-row-reverse text-right",
                      paymentMethod === method.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div
                      className={cn(
                        "w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0",
                        paymentMethod === method.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {method.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                {t.checkout.orderSummary}
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => {
                  const name =
                    locale === "ar"
                      ? item.product.nameAr
                      : item.product.name;
                  return (
                    <div
                      key={item.product.id}
                      className={cn(
                        "flex items-center justify-between gap-2",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <span className="text-sm text-gray-600 truncate">
                        {name}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex-shrink-0">
                        {formatPrice(item.product.price, locale)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row-reverse"
                )}>
                  <span className="font-semibold text-gray-900">
                    {t.checkout.total}
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(total, locale)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={cn(
                  "w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                  isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-wait"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98]"
                )}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.checkout.processing}
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    {t.checkout.placeOrder}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                {locale === "ar"
                  ? "🔒 جميع المعاملات مشفرة وآمنة"
                  : "🔒 Toutes les transactions sont sécurisées"}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
