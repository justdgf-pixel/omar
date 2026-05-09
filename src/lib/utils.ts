import { Locale } from "@/types";

export function formatPrice(price: number, locale: Locale = "fr"): string {
  const formatted = price.toLocaleString("fr-DZ");
  return locale === "ar" ? `${formatted} د.ج` : `${formatted} DA`;
}

export function calculateDiscount(
  price: number,
  originalPrice: number
): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DS-${timestamp}-${random}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}
