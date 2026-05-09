// Chargily Pay (v2) integration for Algerian payments — EDAHABIA & CIB.
// Docs: https://dev.chargily.com/pay-v2/introduction
//
// This module is intentionally framework-agnostic and uses only fetch.
// We accept the secret key from env and return a hosted checkout URL for redirect.
//
// In test mode, if no secret key is configured, we return a mock checkout URL
// pointing at our internal /api/payments/mock endpoint, so local development
// works end-to-end without external credentials.

import crypto from "node:crypto";

const API_BASE = "https://pay.chargily.net/api/v2";

export interface CreateCheckoutInput {
  amountDzd: number;
  orderId: string;
  successUrl: string;
  failureUrl: string;
  webhookUrl: string;
  customerEmail?: string;
  customerName?: string;
  paymentMethod?: "edahabia" | "cib";
  locale?: "ar" | "fr" | "en";
}

export interface CreateCheckoutResult {
  checkoutUrl: string;
  checkoutId: string;
  mock: boolean;
}

export async function createChargilyCheckout(
  input: CreateCheckoutInput
): Promise<CreateCheckoutResult> {
  const secret = process.env.CHARGILY_SECRET_KEY;

  if (!secret) {
    return {
      checkoutUrl: `${input.successUrl.split("?")[0].replace(/\/success$/, "")}/mock?orderId=${encodeURIComponent(
        input.orderId
      )}`,
      checkoutId: `mock_${input.orderId}`,
      mock: true
    };
  }

  const body = {
    amount: input.amountDzd,
    currency: "dzd",
    payment_method: input.paymentMethod ?? "edahabia",
    success_url: input.successUrl,
    failure_url: input.failureUrl,
    webhook_endpoint: input.webhookUrl,
    description: `Order ${input.orderId}`,
    locale: input.locale ?? "ar",
    metadata: [{ key: "order_id", value: input.orderId }]
  };

  const res = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chargily checkout failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { id: string; checkout_url: string };
  return { checkoutUrl: data.checkout_url, checkoutId: data.id, mock: false };
}

// Verify Chargily webhook signature using the configured webhook secret.
// Chargily sends `signature` header computed as HMAC-SHA256 of the raw body.
export function verifyChargilySignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.CHARGILY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signatureHeader, "hex")
    );
  } catch {
    return false;
  }
}
