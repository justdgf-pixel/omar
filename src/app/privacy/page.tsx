export default function PrivacyPage() {
  return (
    <div className="container-page py-12">
      <div className="card mx-auto max-w-2xl p-6 sm:p-8 text-sm text-ink-700">
        <h1 className="text-2xl font-bold">Politique de confidentialité</h1>
        <p className="mt-3">
          Nous collectons uniquement les informations nécessaires à votre compte
          (nom, email, wilaya, téléphone) et au traitement de vos commandes.
          Les justificatifs de paiement sont stockés de manière sécurisée et
          uniquement consultés par l'équipe de vérification.
        </p>
        <p className="mt-3">
          Vos données ne sont jamais revendues. Vous pouvez demander leur
          suppression à tout moment via{" "}
          <a className="text-brand-700 hover:underline" href="mailto:privacy@souk.dz">
            privacy@souk.dz
          </a>
          .
        </p>
      </div>
    </div>
  );
}
