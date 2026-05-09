export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="card mx-auto max-w-2xl p-6 sm:p-8 prose prose-ink">
        <h1>À propos de Souk Digital DZ 🇩🇿</h1>
        <p>
          Souk Digital DZ est une marketplace conçue pour le marché algérien :
          créateurs locaux, paiements locaux, langues locales (AR / FR / EN).
        </p>
        <p>
          Notre mission est simple : permettre à n'importe quel créateur algérien —
          formateur, designer, développeur, photographe — de vendre ses produits
          numériques sans dépendre de plateformes internationales qui ne supportent
          pas nos moyens de paiement.
        </p>
        <h2>Pourquoi nous</h2>
        <ul>
          <li>Paiements adaptés : CIB, Edahabia, BaridiMob, CCP, RIB.</li>
          <li>Commission de 5 % seulement, pas de frais cachés.</li>
          <li>Support en français, arabe (RTL) et anglais.</li>
          <li>Livraison automatique des fichiers via lien sécurisé.</li>
        </ul>
      </div>
    </div>
  );
}
