"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";

type CheckoutFormProps = {
  product: Product;
};

const paymentOptions = [
  {
    value: "CIB",
    label: "CIB card",
    hint: "For customers paying through SATIM-supported bank cards.",
  },
  {
    value: "Edahabia",
    label: "Edahabia",
    hint: "A strong default for local reach and familiar checkout expectations.",
  },
  {
    value: "BaridiMob",
    label: "BaridiMob support",
    hint: "Useful as a support-guided path during early-stage launches.",
  },
] as const;

export default function CheckoutForm({ product }: CheckoutFormProps) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Edahabia");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug: product.slug,
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod,
        }),
      });

      const payload = (await response.json()) as
        | { error?: string; orderUrl?: string }
        | undefined;

      if (!response.ok || !payload?.orderUrl) {
        setErrorMessage(
          payload?.error ?? "The order could not be created. Please try again.",
        );
        return;
      }

      router.push(payload.orderUrl);
    } catch {
      setErrorMessage("Network error while creating the order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Full name
          </span>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
            placeholder="Omar B."
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
            placeholder="omar@example.com"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Phone or WhatsApp
        </span>
        <input
          value={customerPhone}
          onChange={(event) => setCustomerPhone(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
          placeholder="+213 555 00 00 00"
          autoComplete="tel"
        />
      </label>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">Payment method</p>
        <div className="grid gap-3">
          {paymentOptions.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-[1.5rem] border p-4 transition ${
                paymentMethod === option.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {option.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {option.hint}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950/80">
        Demo note: this starter creates the order instantly so you can test the
        flow. In production, only unlock the product after a payment callback.
      </div>

      {errorMessage ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Creating order..."
          : `Create demo order - ${formatPrice(product.priceDzd)}`}
      </button>
    </form>
  );
}
