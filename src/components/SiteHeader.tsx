import Link from "next/link";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { t, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  user: {
    id: string;
    name: string;
    role: "BUYER" | "SELLER" | "ADMIN";
    isSeller: boolean;
  } | null;
  cartCount: number;
};

export function SiteHeader({ locale, user, cartCount }: Props) {
  const tt = (k: string) => t(locale, k);
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold"
          >
            DZ
          </span>
          <span className="hidden text-base font-semibold text-ink-900 sm:inline">
            Souk Digital
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          <Link href="/catalog" className="btn-ghost">
            {tt("nav.catalog")}
          </Link>
          <Link href="/categories" className="btn-ghost">
            {tt("nav.categories")}
          </Link>
          <Link href="/sell" className="btn-ghost">
            {tt("nav.sell")}
          </Link>
        </nav>

        <form action="/catalog" method="get" className="ms-auto hidden md:block">
          <input
            name="q"
            type="search"
            placeholder={tt("common.search")}
            className="input w-72"
            aria-label={tt("common.search")}
          />
        </form>

        <div className="flex items-center gap-1">
          <LocaleSwitcher current={locale} />
          <Link
            href="/cart"
            className="btn-ghost relative"
            aria-label={tt("nav.cart")}
          >
            <span aria-hidden>🛒</span>
            <span className="hidden lg:inline">{tt("nav.cart")}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -end-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="btn-ghost">
                  {tt("nav.admin")}
                </Link>
              )}
              {(user.role === "SELLER" || user.isSeller) && (
                <Link href="/seller" className="btn-ghost">
                  {tt("nav.dashboard")}
                </Link>
              )}
              <Link href="/account" className="btn-outline">
                {user.name.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/signin" className="btn-ghost">
                {tt("nav.signin")}
              </Link>
              <Link href="/signup" className="btn-primary">
                {tt("nav.signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
