"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductToggle({
  productId,
  published,
}: {
  productId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(published);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !isPublished }),
      });
      setIsPublished(!isPublished);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        isPublished ? "bg-emerald-500" : "bg-gray-300"
      } ${loading ? "opacity-50" : ""}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          isPublished ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}
