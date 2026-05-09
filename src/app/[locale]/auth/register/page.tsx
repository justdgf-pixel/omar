"use client";

import { use, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { WILAYAS } from "@/lib/wilayas";

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("auth");
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    wilaya: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error?.toString() ?? "Registration failed");
      setPending(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setPending(false);
    router.push(`/${locale}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6">
        <h1 className="mb-6 text-xl font-bold">{t("registerTitle")}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">{t("name")}</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">{t("email")}</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("password")}</label>
            <input
              type="password"
              required
              minLength={8}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t("phone")}</label>
              <input
                className="input"
                placeholder="+213..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t("wilaya")}</label>
              <select
                className="input"
                value={form.wilaya}
                onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
              >
                <option value="">—</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {locale === "ar" ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={form.role === "CUSTOMER"}
                onChange={() => setForm({ ...form, role: "CUSTOMER" })}
              />
              {locale === "ar" ? "مشتري" : locale === "fr" ? "Acheteur" : "Buyer"}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={form.role === "SELLER"}
                onChange={() => setForm({ ...form, role: "SELLER" })}
              />
              {locale === "ar" ? "بائع" : locale === "fr" ? "Vendeur" : "Seller"}
            </label>
          </div>
          {error && <div className="text-sm text-accent-500">{error}</div>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "..." : t("submit")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          {t("haveAccount")}{" "}
          <Link href={`/${locale}/auth/login`} className="text-brand-700 hover:underline">
            {t("loginTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
