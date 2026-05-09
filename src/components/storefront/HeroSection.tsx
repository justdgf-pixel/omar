"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="text-2xl">🇩🇿</span>
            <span className="text-sm text-primary-100 font-medium">Première marketplace digitale en Algérie</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Achetez des produits
            <span className="block bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
              numériques en DZD
            </span>
          </h1>

          <p className="text-lg md:text-xl text-primary-200 mb-8 max-w-2xl leading-relaxed">
            E-books, cours en ligne, templates, logiciels et plus encore.
            Payez facilement avec CCP, BaridiMob ou carte EDAHABIA.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" variant="secondary">
                Explorer les produits
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button size="lg" variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Créer un compte
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-primary-300">Produits digitaux</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-sm text-primary-300">Moyens de paiement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">58</div>
              <div className="text-sm text-primary-300">Wilayas couvertes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
