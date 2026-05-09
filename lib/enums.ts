// Enum-like string unions matching the values stored in SQLite.

export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN';
export const ROLES: readonly Role[] = ['CUSTOMER', 'SELLER', 'ADMIN'] as const;

export type PaymentMethod = 'CCP' | 'BARIDIMOB' | 'CIB_EDAHABIA' | 'BANK_TRANSFER';
export const PAYMENT_METHODS: readonly PaymentMethod[] = [
  'CCP',
  'BARIDIMOB',
  'CIB_EDAHABIA',
  'BANK_TRANSFER',
] as const;

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'AWAITING_REVIEW'
  | 'PAID'
  | 'CANCELLED'
  | 'REFUNDED';
export const ORDER_STATUSES: readonly OrderStatus[] = [
  'PENDING_PAYMENT',
  'AWAITING_REVIEW',
  'PAID',
  'CANCELLED',
  'REFUNDED',
] as const;

export function isRole(v: string): v is Role {
  return (ROLES as readonly string[]).includes(v);
}
export function isPaymentMethod(v: string): v is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(v);
}
export function isOrderStatus(v: string): v is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(v);
}
