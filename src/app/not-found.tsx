import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-3 text-2xl font-bold">Page introuvable</h1>
        <p className="mt-2 text-ink-500">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
