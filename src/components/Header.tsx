"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ShoppingBag, User2, Store, LayoutDashboard, LogIn } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import type { Locale } from "@/lib/i18n";

export interface HeaderMessages {
  siteName: string;
  home: string;
  catalog: string;
  sell: string;
  dashboard: string;
  cart: string;
  login: string;
  register: string;
  logout: string;
}

interface Props {
  locale: Locale;
  messages: HeaderMessages;
}

export default function Header({ locale, messages: m }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const { count } = useCart();
  const { data: session } = useSession();

  function switchLocale(target: Locale) {
    const segs = pathname.split("/");
    if (segs.length > 1) segs[1] = target;
    return segs.join("/") || `/${target}`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <Store size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {m.siteName}
          </span>
        </Link>

        <nav className="ms-auto hidden items-center gap-1 md:flex">
          <NavLink href={`/${locale}`}>{m.home}</NavLink>
          <NavLink href={`/${locale}/catalog`}>{m.catalog}</NavLink>
          <NavLink href={`/${locale}/sell`}>{m.sell}</NavLink>
          {session?.user ? (
            <NavLink href={`/${locale}/dashboard`}>
              <span className="inline-flex items-center gap-1.5">
                <LayoutDashboard size={16} />
                {m.dashboard}
              </span>
            </NavLink>
          ) : null}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-2">
          <Link
            href={`/${locale}/cart`}
            className="relative rounded-xl p-2 text-slate-700 hover:bg-slate-100"
            aria-label={m.cart}
          >
            <ShoppingBag size={20} />
            {count > 0 ? (
              <span className="absolute -end-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            ) : null}
          </Link>

          <div className="hidden items-center rounded-xl bg-slate-100 p-1 text-xs sm:flex">
            {(["ar", "fr", "en"] as Locale[]).map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                className={`rounded-lg px-2 py-1 ${
                  l === locale
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>

          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="btn-ghost"
              title={m.logout}
            >
              <User2 size={18} />
              <span className="hidden sm:inline">{m.logout}</span>
            </button>
          ) : (
            <>
              <Link
                href={`/${locale}/auth/login`}
                className="btn-ghost"
                title={m.login}
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">{m.login}</span>
              </Link>
              <Link href={`/${locale}/auth/register`} className="btn-primary">
                {m.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}
