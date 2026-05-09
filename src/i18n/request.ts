import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, locales, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const active = (requested ?? defaultLocale) as Locale;
  if (!locales.includes(active)) notFound();
  const messages = (await import(`./messages/${active}.json`)).default;
  return { locale: active, messages };
});
