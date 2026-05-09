import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  t: (k: string) => string;
};

export function SiteFooter({ t }: Props) {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="container-page py-10 text-sm text-ink-600">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-bold text-white">
                DZ
              </span>
              <span className="text-base font-semibold text-ink-900">
                Souk Digital
              </span>
            </div>
            <p>{t("site.tagline")}</p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-ink-900">
              {t("footer.about")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-brand-700">
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-brand-700">
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-brand-700">
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-brand-700">
                  {t("footer.privacy")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-ink-900">
              {t("nav.categories")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/c/ebooks" className="hover:text-brand-700">
                  Ebooks
                </a>
              </li>
              <li>
                <a href="/c/courses" className="hover:text-brand-700">
                  Formations
                </a>
              </li>
              <li>
                <a href="/c/templates" className="hover:text-brand-700">
                  Templates
                </a>
              </li>
              <li>
                <a href="/c/design" className="hover:text-brand-700">
                  Design assets
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-ink-900">
              {t("footer.payments")}
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="badge">CIB</span>
              <span className="badge">Edahabia</span>
              <span className="badge">BaridiMob</span>
              <span className="badge">CCP</span>
              <span className="badge">RIB</span>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              © {new Date().getFullYear()} Souk Digital DZ — Made in 🇩🇿
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
