"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard, Search } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("digidz-user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("digidz-user");
    localStorage.removeItem("digidz-token");
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Digi<span className="text-emerald-600">DZ</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/products" className="p-2 text-gray-500 hover:text-gray-700 md:hidden"><Search className="w-5 h-5" /></Link>
            <Link href="/cart" className="relative p-2 text-gray-500 hover:text-gray-700">
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-medium">{itemCount()}</span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href={user.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer"} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Sign In</Link>
                <Link href="/auth/signup" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${pathname === link.href ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"}`}>
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          {user ? (
            <>
              <Link href={user.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full text-left">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Sign In</Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
