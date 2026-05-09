"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ApproveButtons({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "reject") {
    setBusy(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => act("approve")} disabled={busy} className="btn-primary">
        ✓
      </button>
      <button
        onClick={() => act("reject")}
        disabled={busy}
        className="btn-secondary text-accent-500 ring-rose-200 hover:bg-rose-50"
      >
        ✕
      </button>
    </div>
  );
}
