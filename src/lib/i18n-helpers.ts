import type { Locale } from "@/i18n/config";

export type LocalizedFields = "title" | "desc" | "name";

/** Pick the right field on a Product / Category given the active locale. */
export function pickLocalized<T extends Record<string, unknown>>(
  obj: T,
  base: "title" | "desc" | "name",
  locale: Locale,
): string {
  const key = `${base}${locale === "ar" ? "Ar" : locale === "fr" ? "Fr" : "En"}` as keyof T;
  return (obj[key] as string) ?? "";
}
