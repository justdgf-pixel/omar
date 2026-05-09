import type { Locale } from "./i18n";

/**
 * Format an amount stored in DZD (whole units) for display.
 * The Algerian Dinar conventionally has no centimes in retail.
 */
export function formatDzd(amount: number, locale: Locale = "fr"): string {
  const tag =
    locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-DZ";
  try {
    return new Intl.NumberFormat(tag, {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if the runtime ICU doesn't have DZ tag
    const formatted = new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(amount);
    return locale === "ar" ? `${formatted} د.ج` : `${formatted} DA`;
  }
}
