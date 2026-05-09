import Link from 'next/link';
import type { User } from '@prisma/client';
import type { Locale } from '@/lib/i18n';
import { LocaleSwitcher } from './LocaleSwitcher';

type Dict = Record<string, string>;

export function Header({
  locale,
  dict,
  user,
  cartCount,
}: {
  locale: Locale;
  dict: Dict;
  user: User | null;
  cartCount: number;
}) {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <span className="inline-block h-8 w-8 rounded-md bg-brand-600 text-white grid place-items-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h18l-2 13H5L3 7Z" strokeLinejoin="round" />
              <path d="M8 7V5a4 4 0 1 1 8 0v2" strokeLinecap="round" />
            </svg>
          </span>
          <span>{dict.brand}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm text-slate-700">
          <Link href="/products" className="hover:text-brand-700">{dict.products}</Link>
          <Link href="/categories" className="hover:text-brand-700">{dict.categories}</Link>
          <Link href="/about" className="hover:text-brand-700">{dict.about}</Link>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <Link href="/cart" className="relative btn-secondary text-sm">
            {dict.cart}
            {cartCount > 0 && (
              <span className="ms-2 rounded-full bg-accent text-white text-[11px] px-1.5 ltr-numbers">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <UserMenu user={user} dict={dict} />
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">{dict.login}</Link>
              <Link href="/signup" className="btn-primary text-sm">{dict.signup}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({ user, dict }: { user: User; dict: Dict }) {
  return (
    <div className="flex items-center gap-2">
      {user.role === 'ADMIN' && (
        <Link href="/admin" className="btn-secondary text-sm">{dict.admin}</Link>
      )}
      {user.role === 'SELLER' && (
        <Link href="/seller" className="btn-secondary text-sm">{dict.sellerDashboard}</Link>
      )}
      <Link href="/account" className="btn-secondary text-sm">{dict.myAccount}</Link>
      <form action="/api/auth/logout" method="POST">
        <button type="submit" className="btn-secondary text-sm">{dict.logout}</button>
      </form>
    </div>
  );
}
