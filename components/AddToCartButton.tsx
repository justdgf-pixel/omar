'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function AddToCartButton({
  productId,
  label,
  buyNowLabel,
}: {
  productId: string;
  label: string;
  buyNowLabel: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function add(buyNow = false) {
    start(async () => {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setDone(true);
      router.refresh();
      if (buyNow) router.push('/checkout');
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => add(false)}
        className="btn-secondary"
      >
        {done && !pending ? '✓' : ''} {label}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => add(true)}
        className="btn-primary"
      >
        {buyNowLabel}
      </button>
    </div>
  );
}
