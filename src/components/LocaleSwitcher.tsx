"use client";

import Link from "next/link";
import { locales, localeMeta, type Locale } from "@/i18n/config";

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${target}`;
  segments[0] = target;
  return "/" + segments.join("/");
}

export function LocaleSwitcher({ current, pathname }: { current: Locale; pathname: string }) {
  return (
    <div className="hidden items-center gap-1 sm:flex">
      {locales.map((l) => (
        <Link
          key={l}
          href={swapLocale(pathname, l)}
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            l === current ? "bg-brand-50 text-brand-700" : "text-stone-500 hover:bg-stone-100"
          }`}
          aria-current={l === current ? "true" : undefined}
        >
          {localeMeta[l].label}
        </Link>
      ))}
    </div>
  );
}
