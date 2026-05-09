'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = { ar: 'AR', fr: 'FR', en: 'EN' };

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function setLocale(next: Locale) {
    start(async () => {
      await fetch('/api/locale', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-xs">
      {(Object.keys(labels) as Locale[]).map((l) => (
        <button
          key={l}
          disabled={pending}
          onClick={() => setLocale(l)}
          className={`px-2 py-1 ${l === locale ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
