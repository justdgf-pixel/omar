"use client";

export default function PaymentMethods() {
  const methods = [
    { name: "CCP", desc: "Compte Courant Postal", icon: "🏤", color: "from-yellow-400 to-yellow-600" },
    { name: "BaridiMob", desc: "Paiement mobile", icon: "📱", color: "from-green-400 to-green-600" },
    { name: "EDAHABIA", desc: "Carte de paiement", icon: "💳", color: "from-amber-400 to-amber-600" },
    { name: "Virement", desc: "Bancaire", icon: "🏦", color: "from-blue-400 to-blue-600" },
  ];

  return (
    <section className="py-16 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            Paiement facile en Dinar Algérien
          </h2>
          <p className="text-text-secondary mt-2">Choisissez le moyen de paiement qui vous convient</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {methods.map((m) => (
            <div key={m.name} className="bg-white rounded-2xl border border-border p-6 text-center hover:shadow-md transition-all">
              <div className={`w-14 h-14 bg-gradient-to-br ${m.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl`}>
                {m.icon}
              </div>
              <h3 className="font-semibold text-text-primary">{m.name}</h3>
              <p className="text-sm text-text-muted mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
