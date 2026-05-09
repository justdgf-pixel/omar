'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function RemoveFromCart({ productId, label }: { productId: string; label: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm text-rose-600 hover:underline"
      onClick={() =>
        start(async () => {
          await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ productId }),
          });
          router.refresh();
        })
      }
    >
      {label}
    </button>
  );
}
