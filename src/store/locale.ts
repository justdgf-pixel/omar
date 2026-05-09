import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Locale } from "@/types";
import { translations, Translations } from "@/lib/translations";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  isRTL: boolean;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "fr",
      t: translations.fr,
      isRTL: false,

      setLocale: (locale: Locale) => {
        set({
          locale,
          t: translations[locale],
          isRTL: locale === "ar",
        });
      },
    }),
    {
      name: "digisouk-locale",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      skipHydration: true,
    }
  )
);
