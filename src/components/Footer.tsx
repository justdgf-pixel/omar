import type { Locale } from "@/lib/i18n";

interface Props {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export default function Footer({ t }: Props) {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {t("site.name")}
          </div>
          <p className="mt-2 max-w-sm text-sm text-slate-600">{t("footer.about")}</p>
        </div>
        <div className="text-sm text-slate-600">
          <div className="font-medium text-slate-900">{t("home.payments.title")}</div>
          <ul className="mt-2 space-y-1">
            <li>EDAHABIA — Chargily Pay</li>
            <li>CIB — Chargily Pay</li>
            <li>BaridiMob</li>
            <li>Bank transfer (CCP/BNA/BEA)</li>
          </ul>
        </div>
        <div className="text-sm text-slate-500 md:text-end">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
