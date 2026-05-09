import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { signupAction } from "@/app/actions/auth";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
  "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt",
  "Djanet", "El M'Ghair", "El Meniaa",
];

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  return (
    <div className="container-page py-12">
      <div className="card mx-auto max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{t(locale, "auth.signup")}</h1>
        {sp.error && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {sp.error}
          </p>
        )}
        <form action={signupAction} className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="name">{t(locale, "auth.name")}</label>
            <input id="name" name="name" required minLength={2} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">{t(locale, "auth.email")}</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">{t(locale, "auth.password")}</label>
            <input id="password" name="password" type="password" required minLength={6} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="wilaya">Wilaya</label>
              <select id="wilaya" name="wilaya" className="input">
                <option value="">—</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <input id="phone" name="phone" placeholder="0555…" className="input" />
            </div>
          </div>
          <button className="btn-primary w-full">{t(locale, "auth.signup")}</button>
        </form>
        <p className="mt-4 text-sm text-ink-500">
          {t(locale, "auth.have_account")}{" "}
          <Link href="/signin" className="text-brand-700 hover:underline">
            {t(locale, "auth.signin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
