import type { Locale } from "./i18n";

export function formatDzd(amount: number, locale: Locale = "ar"): string {
  const intl =
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-DZ";
  try {
    return new Intl.NumberFormat(intl, {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    const symbol = locale === "ar" ? "د.ج" : locale === "fr" ? "DA" : "DZD";
    return `${amount.toLocaleString()} ${symbol}`;
  }
}
