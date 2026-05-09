import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { signinAction } from "@/app/actions/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  return (
    <div className="container-page py-12">
      <div className="card mx-auto max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{t(locale, "auth.signin")}</h1>
        {sp.error && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {sp.error}
          </p>
        )}
        <form action={signinAction} className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="email">{t(locale, "auth.email")}</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">{t(locale, "auth.password")}</label>
            <input id="password" name="password" type="password" required minLength={6} className="input" />
          </div>
          <button className="btn-primary w-full">{t(locale, "auth.signin")}</button>
        </form>
        <p className="mt-4 text-sm text-ink-500">
          {t(locale, "auth.no_account")}{" "}
          <Link href="/signup" className="text-brand-700 hover:underline">
            {t(locale, "auth.signup")}
          </Link>
        </p>
        <div className="mt-6 rounded-lg border border-dashed border-ink-200 p-3 text-xs text-ink-500">
          <p className="font-semibold text-ink-700">Comptes de démo</p>
          <p>admin@souk.dz / admin1234</p>
          <p>seller@souk.dz / seller1234</p>
          <p>buyer@souk.dz / buyer1234</p>
        </div>
      </div>
    </div>
  );
}
