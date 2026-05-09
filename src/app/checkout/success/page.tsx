"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { cn } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "N/A";
  const { locale, t, isRTL } = useLocaleStore();

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-20 text-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="animate-scale-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-fade-in">
        {t.success.title}
      </h1>
      <p className="text-gray-500 text-lg mb-6 animate-fade-in">
        {t.success.message}
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 inline-block animate-slide-up">
        <p className="text-sm text-gray-500 mb-1">{t.success.orderNumber}</p>
        <p className="text-xl font-bold text-gray-900 font-mono">{orderId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all">
          <Download size={18} />
          {t.success.downloadNow}
        </button>
        <Link
          href="/"
          className={cn(
            "inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all",
            isRTL && "flex-row-reverse"
          )}
        >
          <Home size={18} />
          {t.success.backHome}
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" />
          <div className="h-8 bg-gray-100 rounded-lg w-64 mx-auto mb-3 animate-pulse" />
          <div className="h-5 bg-gray-100 rounded-lg w-96 mx-auto animate-pulse" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
