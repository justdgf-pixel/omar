"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            First Algerian Digital Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Buy & Sell{" "}<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Digital Products</span>{" "}in Algeria
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            E-books, courses, templates, software and more. Pay with CCP, BaridiMob or Edahabia. Instant digital delivery across all 58 wilayas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all">
              Start Selling
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
          {[
            { icon: Zap, title: "Instant Delivery", desc: "Download immediately" },
            { icon: ShieldCheck, title: "Secure Payments", desc: "CCP, BaridiMob, Edahabia" },
            { icon: Globe, title: "All 58 Wilayas", desc: "Available nationwide" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="font-semibold text-gray-900 text-sm">{title}</p><p className="text-xs text-gray-500">{desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
