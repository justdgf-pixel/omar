import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "DZD") {
  if (currency === "DZD") {
    return new Intl.NumberFormat("ar-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return `${amount.toLocaleString()} ${currency}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export const WILAYAS = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة",
  "بشار", "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت",
  "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة",
  "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم",
  "المسيلة", "معسكر", "ورقلة", "وهران", "البيض", "إليزي", "برج بوعريريج",
  "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة", "سوق أهراس",
  "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان",
  "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس", "عين صالح",
  "عين قزام", "تقرت", "جانت", "المغير", "المنيعة",
];

export const PAYMENT_METHODS = [
  {
    id: "cib",
    name: "بطاقة CIB",
    nameEn: "CIB Card",
    description: "الدفع عبر بطاقة CIB البنكية",
    icon: "💳",
    color: "bg-blue-600",
  },
  {
    id: "baridimob",
    name: "بريدي موب",
    nameEn: "BaridiMob",
    description: "الدفع عبر تطبيق بريدي موب",
    icon: "📱",
    color: "bg-yellow-500",
  },
  {
    id: "baridipay",
    name: "بريدي باي",
    nameEn: "BaridiPay",
    description: "الدفع عبر بريدي باي الإلكتروني",
    icon: "🏦",
    color: "bg-orange-500",
  },
  {
    id: "dahabiya",
    name: "بطاقة الذهبية",
    nameEn: "Dahabiya",
    description: "الدفع عبر بطاقة الذهبية بريد الجزائر",
    icon: "🥇",
    color: "bg-yellow-600",
  },
];
