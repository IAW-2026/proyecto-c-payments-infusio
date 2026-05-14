"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PaymentStatusSelectorProps = {
  paymentId: number;
  currentStatus: string;
};

export function PaymentStatusSelector({ paymentId, currentStatus }: PaymentStatusSelectorProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
        toast.success("Estado actualizado", {
          description: `La orden cambió a "${newStatus}".`,
        });
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error("No se pudo actualizar", {
          description: data?.error ?? "Ocurrió un error inesperado.",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-tan/30 text-brown",
    accepted: "bg-olive/10 text-olive",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isLoading}
        className={`px-3 py-1.5 rounded-full text-xs font-medium outline-none appearance-none cursor-pointer border border-transparent hover:border-tan/30 transition-colors ${statusStyles[status] ?? statusStyles.pending}`}
      >
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {isLoading && <span className="text-xs text-brown/50">Saving...</span>}
    </div>
  );
}
