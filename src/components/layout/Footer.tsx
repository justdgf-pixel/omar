import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <span>🛍️</span> RakamDZ
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              منصة الجزائر الأولى لبيع وشراء المنتجات الرقمية. برمجيات، قوالب، دورات تعليمية والمزيد.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">المنتجات</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=software" className="hover:text-emerald-400 transition-colors">البرمجيات</Link></li>
              <li><Link href="/products?category=design" className="hover:text-emerald-400 transition-colors">قوالب التصميم</Link></li>
              <li><Link href="/products?category=education" className="hover:text-emerald-400 transition-colors">الدورات التعليمية</Link></li>
              <li><Link href="/products?category=music" className="hover:text-emerald-400 transition-colors">الموسيقى والصوتيات</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">الدعم</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/how-to-pay" className="hover:text-emerald-400 transition-colors">كيفية الدفع</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">تواصل معنا</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">سياسة الاسترداد</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">طرق الدفع المقبولة</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["💳 CIB", "📱 BaridiMob", "🏦 BaridiPay", "🥇 Dahabiya"].map((m) => (
                <span key={m} className="bg-gray-800 rounded-lg px-2 py-1.5 text-center">{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RakamDZ. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-gray-300">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
