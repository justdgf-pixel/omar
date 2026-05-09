'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Une erreur s'est produite</h1>
      <p className="text-slate-600 mt-2">{error.message}</p>
      <button onClick={reset} className="btn-primary mt-6">Réessayer</button>
    </div>
  );
}
