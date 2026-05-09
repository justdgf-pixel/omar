"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tBrand = useTranslations("brand");
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-stone-500 md:flex-row">
        <p>{t("tagline")}</p>
        <p>
          © {year} {tBrand("name")} — {t("rights")}
        </p>
      </div>
    </footer>
  );
}
