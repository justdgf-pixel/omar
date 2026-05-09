import type { Locale } from "./i18n";

export type PaymentMethod =
  | "CIB_EDAHABIA"
  | "BARIDIMOB"
  | "CCP_TRANSFER"
  | "RIB_BANK_TRANSFER";

export const PAYMENT_METHODS: PaymentMethod[] = [
  "CIB_EDAHABIA",
  "BARIDIMOB",
  "CCP_TRANSFER",
  "RIB_BANK_TRANSFER",
];

export function isManualMethod(m: PaymentMethod) {
  return m !== "CIB_EDAHABIA";
}

/** True if SATIM credentials are configured (real online payments enabled). */
export function isSatimConfigured() {
  return Boolean(
    process.env.SATIM_MERCHANT_ID &&
      process.env.SATIM_API_USERNAME &&
      process.env.SATIM_API_PASSWORD,
  );
}

export function methodLabel(m: PaymentMethod, locale: Locale): string {
  const labels: Record<PaymentMethod, Record<Locale, string>> = {
    CIB_EDAHABIA: {
      ar: "بطاقة CIB / Edahabia",
      fr: "Carte CIB / Edahabia",
      en: "CIB / Edahabia card",
    },
    BARIDIMOB: { ar: "BaridiMob", fr: "BaridiMob", en: "BaridiMob" },
    CCP_TRANSFER: {
      ar: "تحويل CCP",
      fr: "Versement CCP",
      en: "CCP transfer",
    },
    RIB_BANK_TRANSFER: {
      ar: "تحويل بنكي",
      fr: "Virement RIB",
      en: "Bank wire (RIB)",
    },
  };
  return labels[m][locale];
}

export type PaymentInstructions = {
  ccpAccount: string;
  ccpHolder: string;
  baridimobRip: string;
  ribBank: string;
  ribAccount: string;
};

export function getPaymentInstructions(): PaymentInstructions {
  return {
    ccpAccount: process.env.PAYMENT_CCP_ACCOUNT ?? "—",
    ccpHolder: process.env.PAYMENT_CCP_HOLDER ?? "—",
    baridimobRip: process.env.PAYMENT_BARIDIMOB_RIP ?? "—",
    ribBank: process.env.PAYMENT_RIB_BANK ?? "—",
    ribAccount: process.env.PAYMENT_RIB_ACCOUNT ?? "—",
  };
}
