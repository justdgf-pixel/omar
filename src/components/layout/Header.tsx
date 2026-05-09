"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Globe,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLocaleStore } from "@/store/locale";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCartStore();
  const { locale, setLocale, t, isRTL } = useLocaleStore();

  const itemCount = items.length;

  const toggleLocale = () => {
    setLocale(locale === "fr" ? "ar" : "fr");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between h-16",
            isRTL && "flex-row-reverse"
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              {t.site.name}
            </span>
          </Link>

          <nav
            className={cn(
              "hidden md:flex items-center gap-8",
              isRTL && "flex-row-reverse"
            )}
          >
            <Link
              href="/"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              {t.nav.products}
            </Link>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium flex items-center gap-1"
            >
              <LayoutDashboard size={16} />
              {t.nav.admin}
            </Link>
          </nav>

          <div
            className={cn(
              "flex items-center gap-3",
              isRTL && "flex-row-reverse"
            )}
          >
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={toggleLocale}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1"
              title={locale === "fr" ? "العربية" : "Français"}
            >
              <Globe size={20} />
              <span className="text-xs font-medium hidden sm:inline">
                {locale === "fr" ? "AR" : "FR"}
              </span>
            </button>

            <Link
              href="/auth/login"
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all hidden sm:block"
            >
              <User size={20} />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-emerald-600 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="py-3 border-t border-gray-100">
            <form
              action="/products"
              className="relative"
            >
              <Search
                size={18}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-gray-400",
                  isRTL ? "right-4" : "left-4"
                )}
              />
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className={cn(
                  "w-full py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm",
                  isRTL ? "pr-11 pl-4 text-right" : "pl-11 pr-4"
                )}
                dir={isRTL ? "rtl" : "ltr"}
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.products}
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.admin}
            </Link>
            <Link
              href="/auth/login"
              className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.login}
            </Link>
            <Link
              href="/auth/register"
              className="block px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.register}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
