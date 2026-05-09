"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/store/cart";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { type Locale } from "@/i18n/config";
import { useEffect, useState } from "react";

export function Navbar({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const { data: session } = useSession();
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const items = useCart((s) => s.items);
  useEffect(() => setCount(items.length), [items]);

  const link = (href: string) => `/${locale}${href}`;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={link("/")} className="flex items-center gap-2 font-semibold text-brand-700">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">
            S
          </span>
          <span>{tBrand("name")}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href={link("/")} className="btn-ghost">{t("home")}</Link>
          <Link href={link("/browse")} className="btn-ghost">{t("browse")}</Link>
          <Link href={link("/sell")} className="btn-ghost">{t("sell")}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher current={locale} pathname={pathname ?? "/"} />
          <Link href={link("/cart")} className="btn-secondary relative">
            {t("cart")}
            {count > 0 && (
              <span className="absolute -top-1 -end-1 grid h-5 w-5 place-items-center rounded-full bg-accent-500 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-2">
              {session.user.role === "ADMIN" && (
                <Link href={link("/admin")} className="btn-ghost">{t("admin")}</Link>
              )}
              {session.user.role !== "CUSTOMER" && (
                <Link href={link("/seller")} className="btn-ghost">{t("dashboard")}</Link>
              )}
              <Link href={link("/account/downloads")} className="btn-ghost hidden sm:inline-flex">
                {t("myDownloads")}
              </Link>
              <button onClick={() => signOut({ callbackUrl: `/${locale}` })} className="btn-ghost">
                {t("logout")}
              </button>
            </div>
          ) : (
            <>
              <Link href={link("/auth/login")} className="btn-ghost">{t("login")}</Link>
              <Link href={link("/auth/register")} className="btn-primary">{t("register")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
