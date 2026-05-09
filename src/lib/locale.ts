import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./i18n";

const COOKIE = "sdz_locale";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(COOKIE)?.value;
  if (v && (LOCALES as readonly string[]).includes(v)) return v as Locale;
  return DEFAULT_LOCALE;
}

export async function setLocale(locale: Locale) {
  const c = await cookies();
  c.set(COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
