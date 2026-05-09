export const locales = ["ar", "fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const localeMeta: Record<Locale, { label: string; dir: "rtl" | "ltr" }> = {
  ar: { label: "العربية", dir: "rtl" },
  fr: { label: "Français", dir: "ltr" },
  en: { label: "English", dir: "ltr" },
};
