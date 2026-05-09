"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface Props {
  locale: Locale;
  categories: { id: string; name: string }[];
  t: {
    title: string;
    description: string;
    price: string;
    category: string;
    file: string;
    cover: string;
    submit: string;
    loading: string;
    error: string;
  };
}

export default function SellForm({ locale, categories, t }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: fd
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6">
      <div className="grid gap-3 md:grid-cols-3">
        <Field name="titleAr" label="Title (AR)" required />
        <Field name="titleFr" label="Title (FR)" />
        <Field name="titleEn" label="Title (EN)" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Textarea name="descriptionAr" label="Description (AR)" required />
        <Textarea name="descriptionFr" label="Description (FR)" />
        <Textarea name="descriptionEn" label="Description (EN)" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">{t.price}</label>
          <input name="priceDzd" type="number" min="0" required className="input" />
        </div>
        <div>
          <label className="label">{t.category}</label>
          <select name="categoryId" className="input">
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">{t.cover}</label>
        <input name="coverImage" type="url" placeholder="https://..." className="input" />
      </div>
      <div>
        <label className="label">{t.file}</label>
        <input name="file" type="file" className="block w-full text-sm" />
        <p className="mt-1 text-xs text-slate-500">
          PDF, ZIP, MP4… up to ~10MB in this demo.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p>
      ) : null}
      <button disabled={submitting} className="btn-primary justify-self-start">
        {submitting ? t.loading : t.submit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  required
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} required={required} className="input" />
    </div>
  );
}

function Textarea({
  name,
  label,
  required
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea name={name} required={required} className="input min-h-[110px]" />
    </div>
  );
}
