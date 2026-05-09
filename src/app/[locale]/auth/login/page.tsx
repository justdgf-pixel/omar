"use client";

import { use, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setPending(false);
    if (res?.error) setError("Invalid credentials");
    else router.push(`/${locale}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6">
        <h1 className="mb-6 text-xl font-bold">{t("loginTitle")}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">{t("email")}</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t("password")}</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-accent-500">{error}</div>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "..." : t("submit")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/auth/register`} className="text-brand-700 hover:underline">
            {t("registerTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
