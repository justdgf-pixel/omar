import { getDictionary, getLocale } from '@/lib/i18n';

export default function AboutPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{dict.about}</h1>
      <p className="mt-4 text-slate-700 leading-relaxed">{dict.heroSubtitle}</p>

      <h2 className="text-xl font-bold mt-8">{dict.paymentMethods}</h2>
      <ul className="mt-3 grid sm:grid-cols-2 gap-3">
        {[
          dict.paymentCib,
          dict.paymentBaridimob,
          dict.paymentCcp,
          dict.paymentBankTransfer,
        ].map((m) => (
          <li key={m} className="card p-3 text-sm">{m}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-8">{dict.whyUs}</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4">
            <div className="font-semibold">{(dict as any)[`whyUs${i}Title`]}</div>
            <p className="text-sm text-slate-600 mt-1">{(dict as any)[`whyUs${i}Body`]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
