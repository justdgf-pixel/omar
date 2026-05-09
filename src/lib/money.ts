import type { Locale } from "@/i18n/config";

/**
 * Souqami stores all amounts in DZD centimes (1 DZD = 100 centimes) to avoid
 * floating-point issues, identical to the SATIM API which expects amounts in centimes.
 */
export function centimesToDzd(centimes: number): number {
  return centimes / 100;
}

export function dzdToCentimes(dzd: number): number {
  return Math.round(dzd * 100);
}

const localeTags: Record<Locale, string> = {
  ar: "ar-DZ",
  fr: "fr-DZ",
  en: "en-DZ",
};

export function formatDzd(centimes: number, locale: Locale = "ar"): string {
  const value = centimesToDzd(centimes);
  try {
    return new Intl.NumberFormat(localeTags[locale], {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString()} DZD`;
  }
}
