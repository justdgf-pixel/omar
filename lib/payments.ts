/**
 * Payment provider abstraction.
 *
 * Algeria-specific notes:
 *  - CIB / Edahabia online payment is processed via SATIM (the national gateway).
 *    To go live you must onboard with SATIM via your bank and obtain a Merchant ID + API key.
 *    Until then, this module exposes a `cibInitiate` stub that records the intent and
 *    returns a placeholder redirect URL so the rest of the flow can be tested end-to-end.
 *  - BaridiMob and CCP transfers are handled as "manual" payments: the buyer is shown
 *    instructions, submits a reference, and the seller/admin confirms in the dashboard.
 */

import type { PaymentMethod } from './enums';

export interface PaymentInstructions {
  method: PaymentMethod;
  title: string;
  steps: string[];
  account?: string;
  beneficiary?: string;
}

export function getPaymentInstructions(method: PaymentMethod): PaymentInstructions {
  switch (method) {
    case 'CCP':
      return {
        method,
        title: 'CCP / Algérie Poste',
        beneficiary: process.env.PAYMENT_CCP_NAME ?? 'Souk Digital',
        account: process.env.PAYMENT_CCP_ACCOUNT ?? '0023456789 12 / clé 34',
        steps: [
          'Effectuez un versement CCP au compte ci-dessous.',
          "Indiquez le numéro de commande dans la zone 'objet'.",
          "Saisissez la référence du bordereau ci-dessous puis confirmez votre commande.",
          'Vous recevrez un e-mail dès la validation du paiement (sous 24h ouvrées).',
        ],
      };
    case 'BARIDIMOB':
      return {
        method,
        title: 'BaridiMob',
        beneficiary: process.env.PAYMENT_CCP_NAME ?? 'Souk Digital',
        account: process.env.PAYMENT_BARIDIMOB_RIP ?? '00799999000123456789',
        steps: [
          "Ouvrez l'application BaridiMob et choisissez 'Transfert vers RIP'.",
          'Saisissez le RIP du bénéficiaire ci-dessous.',
          "Indiquez le numéro de commande dans le motif.",
          'Saisissez la référence de la transaction puis confirmez.',
        ],
      };
    case 'CIB_EDAHABIA':
      return {
        method,
        title: 'CIB / Edahabia (SATIM)',
        steps: [
          "Vous serez redirigé vers la plateforme sécurisée SATIM.",
          "Saisissez votre numéro de carte CIB ou Edahabia.",
          "Validez avec le code reçu par SMS (3D-Secure).",
          'Vous serez ramené sur le site une fois le paiement confirmé.',
        ],
      };
    case 'BANK_TRANSFER':
      return {
        method,
        title: 'Virement bancaire',
        beneficiary: process.env.PAYMENT_CCP_NAME ?? 'Souk Digital',
        account: process.env.PAYMENT_CCP_ACCOUNT ?? 'RIB à demander au support',
        steps: [
          "Effectuez un virement vers le RIB du bénéficiaire.",
          "Indiquez le numéro de commande dans le libellé.",
          'Saisissez la référence du virement puis confirmez la commande.',
        ],
      };
  }
}

/**
 * Stub for CIB/Edahabia (SATIM) payment initiation.
 * In production, POST to `${SATIM_BASE_URL}/register.do` with merchant credentials,
 * receive a redirection URL and `orderId`, then handle the callback to mark the order paid.
 */
export async function cibInitiate(args: {
  orderNumber: string;
  amountCents: number;
  returnUrl: string;
}): Promise<{ redirectUrl: string }> {
  const merchant = process.env.SATIM_MERCHANT_ID;
  if (!merchant) {
    return {
      redirectUrl: `/checkout/cib-mock?order=${encodeURIComponent(args.orderNumber)}&amount=${args.amountCents}`,
    };
  }
  // Real call would go here — left as TODO to avoid hitting the network in dev.
  return { redirectUrl: args.returnUrl };
}
