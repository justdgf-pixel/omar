import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { becomeSellerAction } from "@/app/actions/seller";

export default async function SellLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const sp = await searchParams;
  if (user?.sellerProfile) redirect("/seller");

  return (
    <div className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Vendez vos produits numériques en Algérie 🇩🇿
          </h1>
          <p className="mt-3 text-ink-600">
            Ouvrez votre boutique en quelques minutes. Encaissez via CCP, BaridiMob,
            RIB ou CIB. Nous nous chargeons de la livraison automatique des fichiers.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3"><span>✅</span><span>Commission de 5 % seulement, sans frais d'inscription.</span></li>
            <li className="flex gap-3"><span>✅</span><span>Paiements adaptés aux clients algériens (CIB, Edahabia, BaridiMob, CCP).</span></li>
            <li className="flex gap-3"><span>✅</span><span>Tableau de bord en français, arabe et anglais.</span></li>
            <li className="flex gap-3"><span>✅</span><span>Téléchargement sécurisé par lien signé pour chaque acheteur.</span></li>
          </ul>

          {!user && (
            <div className="mt-8 flex gap-3">
              <Link href="/signup" className="btn-primary">{t(locale, "auth.signup")}</Link>
              <Link href="/signin" className="btn-outline">{t(locale, "auth.signin")}</Link>
            </div>
          )}
        </div>

        {user && (
          <div className="card p-6">
            <h2 className="text-xl font-bold">Créer ma boutique</h2>
            {sp.error && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {sp.error}
              </p>
            )}
            <form action={becomeSellerAction} className="mt-4 space-y-4">
              <div>
                <label htmlFor="storeName" className="label">Nom de la boutique</label>
                <input id="storeName" name="storeName" required minLength={2} className="input" />
              </div>
              <div>
                <label htmlFor="storeSlug" className="label">URL (slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-500">/s/</span>
                  <input
                    id="storeSlug"
                    name="storeSlug"
                    pattern="[a-z0-9-]+"
                    required
                    minLength={3}
                    className="input"
                    placeholder="ma-boutique"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bio" className="label">Bio</label>
                <textarea id="bio" name="bio" rows={3} className="input" />
              </div>
              <div>
                <label htmlFor="ccpAccount" className="label">CCP (pour recevoir vos paiements)</label>
                <input id="ccpAccount" name="ccpAccount" className="input" />
              </div>
              <button className="btn-primary w-full">Créer ma boutique</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
