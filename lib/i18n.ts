import { cookies } from 'next/headers';
import ar from '@/messages/ar';
import fr from '@/messages/fr';
import en from '@/messages/en';

export const LOCALES = ['ar', 'fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

const dictionaries = { ar, fr, en } as const;

export const LOCALE_COOKIE = 'souk_locale';

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function getLocale(): Locale {
  const fromCookie = cookies().get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  const fallback = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  if (isLocale(fallback)) return fallback;
  return 'ar';
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

type DictKey = keyof typeof ar;
type Dict = Record<DictKey, string>;

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] as unknown as Dict;
}

export function t(locale: Locale, key: DictKey): string {
  const d = getDictionary(locale);
  return d[key] ?? (dictionaries.en as Record<string, string>)[key] ?? String(key);
}

export function localized<T extends Record<string, any>>(
  obj: T,
  field: 'title' | 'description' | 'name',
  locale: Locale
): string {
  const suffix = locale === 'ar' ? 'Ar' : locale === 'fr' ? 'Fr' : 'En';
  return obj[`${field}${suffix}`] ?? obj[`${field}En`] ?? '';
}
