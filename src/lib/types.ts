// Shared union types matching the string-enum conventions used in the Prisma schema.
// SQLite doesn't support real enums; these constants are the source of truth.

export const ROLES = ["CUSTOMER", "SELLER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "REJECTED",
  "CANCELLED",
  "REFUNDED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["CIB", "EDAHABIA", "BARIDIMOB", "CCP_TRANSFER"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
