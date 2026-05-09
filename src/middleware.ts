import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Apply the i18n middleware to every path except API, Next internals, and static assets.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
