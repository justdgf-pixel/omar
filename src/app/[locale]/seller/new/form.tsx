"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pickLocalized } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/config";

type Cat = { id: string; nameAr: string; nameFr: string; nameEn: string };

export function NewProductForm({ locale, categories }: { locale: Locale; categories: Cat[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/seller/products", { method: "POST", body: fd });
    setPending(false);
    if (!res.ok) {
      setError((await res.json()).error?.toString() ?? "Failed");
      return;
    }
    router.push(`/${locale}/seller`);
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="card space-y-5 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Title (AR)" name="titleAr" />
        <Field label="Title (FR)" name="titleFr" />
        <Field label="Title (EN)" name="titleEn" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Textarea label="Description (AR)" name="descAr" />
        <Textarea label="Description (FR)" name="descFr" />
        <Textarea label="Description (EN)" name="descEn" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label">
            {locale === "ar" ? "السعر (دج)" : locale === "fr" ? "Prix (DZD)" : "Price (DZD)"}
          </label>
          <input
            name="priceDzd"
            type="number"
            step="1"
            min="1"
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">
            {locale === "ar" ? "التصنيف" : locale === "fr" ? "Catégorie" : "Category"}
          </label>
          <select name="categoryId" className="input" required defaultValue="">
            <option value="" disabled>
              —
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {pickLocalized(c, "name", locale)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">
          {locale === "ar"
            ? "الملف الرقمي (PDF, ZIP, MP3, ...)"
            : locale === "fr"
              ? "Fichier numérique (PDF, ZIP, MP3, ...)"
              : "Digital file (PDF, ZIP, MP3, ...)"}
        </label>
        <input name="file" type="file" className="block w-full text-sm" required />
      </div>
      <div className="flex items-center gap-2">
        <input id="publish" name="publish" type="checkbox" value="true" defaultChecked />
        <label htmlFor="publish" className="text-sm">
          {locale === "ar"
            ? "نشر فوراً (يمكن إخفاؤه لاحقاً)"
            : locale === "fr"
              ? "Publier immédiatement (vous pouvez masquer plus tard)"
              : "Publish immediately"}
        </label>
      </div>
      {error && <div className="text-sm text-accent-500">{error}</div>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending
          ? "…"
          : locale === "ar"
            ? "حفظ المنتج"
            : locale === "fr"
              ? "Enregistrer"
              : "Save product"}
      </button>
    </form>
  );
}

function Field({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input name={name} className="input" />
    </div>
  );
}
function Textarea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea name={name} className="input min-h-[80px]" />
    </div>
  );
}
