import type { Locale } from './i18n';

export function formatPrice(cents: number, locale: Locale = 'ar') {
  const value = (cents / 100).toFixed(2).replace(/\.00$/, '');
  const localeTag = locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-DZ' : 'en-DZ';
  try {
    return new Intl.NumberFormat(localeTag, {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${value} DZD`;
  }
}

export function formatDate(value: Date | string, locale: Locale = 'ar') {
  const d = value instanceof Date ? value : new Date(value);
  const tag = locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-DZ' : 'en-DZ';
  return new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SK-${ts}-${rand}`;
}
