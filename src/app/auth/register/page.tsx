"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, ChevronDown } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { WILAYAS } from "@/types";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, t, isRTL } = useLocaleStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    wilaya: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"customer" | "seller">("customer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    router.push("/");
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.nav.register}
          </h1>
          <p className="text-gray-500 mt-1">
            {locale === "ar"
              ? "أنشئ حسابك وابدأ الآن"
              : "Créez votre compte et commencez dès maintenant"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
        >
          {/* Account Type Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setAccountType("customer")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                accountType === "customer"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {locale === "ar" ? "مشتري" : "Acheteur"}
            </button>
            <button
              type="button"
              onClick={() => setAccountType("seller")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                accountType === "seller"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {locale === "ar" ? "بائع" : "Vendeur"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.checkout.fullName}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                dir={isRTL ? "rtl" : "ltr"}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.checkout.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="0555 XX XX XX"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.checkout.wilaya}
              </label>
              <select
                value={formData.wilaya}
                onChange={(e) => update("wilaya", e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm cursor-pointer"
                required
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {locale === "ar" ? "كلمة المرور" : "Mot de passe"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm pr-10"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {locale === "ar"
                    ? "تأكيد كلمة المرور"
                    : "Confirmer le mot de passe"}
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <label className={cn("flex items-start gap-2", isRTL && "flex-row-reverse")}>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                required
              />
              <span className="text-sm text-gray-600">
                {locale === "ar"
                  ? "أوافق على شروط الاستخدام وسياسة الخصوصية"
                  : "J'accepte les conditions d'utilisation et la politique de confidentialité"}
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-wait"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  {t.nav.register}
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {locale === "ar"
                ? "لديك حساب بالفعل؟"
                : "Vous avez déjà un compte ?"}{" "}
              <Link
                href="/auth/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t.nav.login}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
