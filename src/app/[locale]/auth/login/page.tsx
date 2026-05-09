"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tFor, type Locale, isLocale } from "@/lib/i18n";

export default function LoginPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params?.locale) ? (params.locale as Locale) : "ar";
  const t = tFor(locale);
  const sp = useSearchParams();
  const router = useRouter();
  const next = sp.get("next") ?? `/${locale}/dashboard`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    setLoading(false);
    if (res?.ok) router.push(next);
    else setError(t("common.error"));
  }

  return (
    <div className="container-page py-16">
      <div className="card mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">{t("auth.email")}</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t("auth.password")}</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? t("common.loading") : t("auth.submit.login")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          <Link
            href={`/${locale}/auth/register`}
            className="font-medium text-brand-700 hover:underline"
          >
            {t("auth.register.title")}
          </Link>
        </p>
      </div>
    </div>
  );
}
