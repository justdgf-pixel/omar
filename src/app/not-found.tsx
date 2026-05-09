import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-sand-50">
        <main className="grid min-h-screen place-items-center p-6 text-center">
          <div>
            <h1 className="text-5xl font-extrabold text-brand-700">404</h1>
            <p className="mt-2 text-slate-600">
              Page not found · الصفحة غير موجودة
            </p>
            <Link
              href="/ar"
              className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
            >
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
