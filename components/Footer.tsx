import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type Dict = Record<string, string>;

export function Footer({ dict }: { locale: Locale; dict: Dict }) {
  return (
    <footer className="border-t border-slate-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm text-slate-600">
        <div>
          <div className="font-semibold text-slate-800">{dict.brand}</div>
          <p className="mt-2 text-slate-500">{dict.tagline}</p>
        </div>
        <div>
          <div className="font-semibold text-slate-800">{dict.paymentMethods}</div>
          <ul className="mt-2 space-y-1">
            <li>{dict.paymentCib}</li>
            <li>{dict.paymentBaridimob}</li>
            <li>{dict.paymentCcp}</li>
            <li>{dict.paymentBankTransfer}</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-800">{dict.products}</div>
          <ul className="mt-2 space-y-1">
            <li><Link className="hover:text-brand-700" href="/products">{dict.products}</Link></li>
            <li><Link className="hover:text-brand-700" href="/categories">{dict.categories}</Link></li>
            <li><Link className="hover:text-brand-700" href="/about">{dict.about}</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
        © {new Date().getFullYear()} — {dict.footerNote}
      </div>
    </footer>
  );
}
