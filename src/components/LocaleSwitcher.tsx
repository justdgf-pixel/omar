"use client";

import { useTransition } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { setLocaleAction } from "@/app/actions/locale";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Language"
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value as Locale;
        const fd = new FormData();
        fd.set("locale", v);
        start(() => {
          void setLocaleAction(fd);
        });
      }}
      className="hidden rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm sm:block"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
