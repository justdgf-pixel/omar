"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore, useAuthStore } from "@/lib/store";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, [setUser]);

  const t = {
    fr: { home: "Accueil", products: "Produits", cart: "Panier", login: "Connexion", register: "Inscription", admin: "Admin", orders: "Mes commandes", logout: "Déconnexion" },
    ar: { home: "الرئيسية", products: "المنتجات", cart: "السلة", login: "تسجيل الدخول", register: "التسجيل", admin: "لوحة التحكم", orders: "طلباتي", logout: "تسجيل الخروج" },
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
              DigiStore DZ
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors">
              {t[lang].home}
            </Link>
            <Link href="/products" className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors">
              {t[lang].products}
            </Link>
            {user && (
              <Link href="/orders" className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors">
                {t[lang].orders}
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
                {t[lang].admin}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
              className="text-xs font-medium px-2 py-1 rounded-lg border border-border hover:bg-surface-tertiary transition-colors cursor-pointer"
            >
              {lang === "fr" ? "عربي" : "FR"}
            </button>

            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-surface-tertiary transition-colors">
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-text-secondary">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>{t[lang].logout}</Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth?mode=login">
                  <Button variant="ghost" size="sm">{t[lang].login}</Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button variant="primary" size="sm">{t[lang].register}</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-tertiary transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary" onClick={() => setMenuOpen(false)}>
              {t[lang].home}
            </Link>
            <Link href="/products" className="block px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary" onClick={() => setMenuOpen(false)}>
              {t[lang].products}
            </Link>
            {user && (
              <Link href="/orders" className="block px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary" onClick={() => setMenuOpen(false)}>
                {t[lang].orders}
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="block px-3 py-2 rounded-xl text-sm font-medium text-accent-600 hover:bg-surface-tertiary" onClick={() => setMenuOpen(false)}>
                {t[lang].admin}
              </Link>
            )}
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-surface-tertiary cursor-pointer">
                {t[lang].logout}
              </button>
            ) : (
              <>
                <Link href="/auth?mode=login" className="block px-3 py-2 rounded-xl text-sm font-medium text-primary-600 hover:bg-surface-tertiary" onClick={() => setMenuOpen(false)}>
                  {t[lang].login}
                </Link>
                <Link href="/auth?mode=register" className="block px-3 py-2 rounded-xl text-sm font-medium text-primary-600 hover:bg-surface-tertiary" onClick={() => setMenuOpen(false)}>
                  {t[lang].register}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
