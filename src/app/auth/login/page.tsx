"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { locale, t, isRTL } = useLocaleStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.nav.login}
          </h1>
          <p className="text-gray-500 mt-1">
            {locale === "ar"
              ? "مرحبًا بعودتك! سجّل دخولك"
              : "Bon retour ! Connectez-vous à votre compte"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t.checkout.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {locale === "ar" ? "كلمة المرور" : "Mot de passe"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <label className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">
                  {locale === "ar" ? "تذكرني" : "Se souvenir de moi"}
                </span>
              </label>
              <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                {locale === "ar" ? "نسيت كلمة المرور؟" : "Mot de passe oublié ?"}
              </a>
            </div>

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
                  <LogIn size={18} />
                  {t.nav.login}
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {locale === "ar" ? "ليس لديك حساب؟" : "Pas encore de compte ?"}{" "}
              <Link
                href="/auth/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t.nav.register}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
