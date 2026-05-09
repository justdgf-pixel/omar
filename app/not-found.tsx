import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl">🇩🇿</div>
      <h1 className="text-3xl font-bold mt-4">404</h1>
      <p className="text-slate-600 mt-2">الصفحة غير موجودة · Page introuvable · Page not found</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">→ Souk Digital</Link>
    </div>
  );
}
