"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";

export default function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("فشل التحديث");
      toast({ title: `تم تحديث الحالة إلى: ${status}`, variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "حدث خطأ", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "paid") {
    return <span className="text-xs text-green-600 font-medium">✓ مكتمل</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {currentStatus === "pending" && (
        <button
          onClick={() => updateStatus("paid")}
          disabled={loading}
          className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "..." : "✓ تأكيد الدفع"}
        </button>
      )}
      {currentStatus !== "failed" && currentStatus !== "refunded" && (
        <button
          onClick={() => updateStatus("failed")}
          disabled={loading}
          className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-md hover:bg-red-200 disabled:opacity-50"
        >
          رفض
        </button>
      )}
    </div>
  );
}
