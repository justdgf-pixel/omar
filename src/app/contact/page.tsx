export default function ContactPage() {
  return (
    <div className="container-page py-12">
      <div className="card mx-auto max-w-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="mt-2 text-ink-600">
          Une question ? Un problème de paiement ? Notre équipe vous répond.
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          <li>📧 <a className="text-brand-700 hover:underline" href="mailto:hello@souk.dz">hello@souk.dz</a></li>
          <li>📞 +213 (0)5 55 00 00 00</li>
          <li>📍 Alger, Algérie</li>
        </ul>
      </div>
    </div>
  );
}
