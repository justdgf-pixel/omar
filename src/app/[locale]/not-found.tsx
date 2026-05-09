import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-6 text-stone-500">Not found · غير موجود · Introuvable</p>
      <Link href="/" className="btn-primary">Home</Link>
    </div>
  );
}
