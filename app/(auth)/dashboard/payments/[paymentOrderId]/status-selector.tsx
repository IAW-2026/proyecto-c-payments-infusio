"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

type PaymentStatusSelectorProps = {
  paymentId: number;
  currentStatus: string;
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptado",
  cancelled: "Cancelado",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-300",
  accepted: "bg-emerald-100 text-emerald-900 border-emerald-300",
  cancelled: "bg-red-100 text-red-900 border-red-300",
};

const optionHoverStyles: Record<string, string> = {
  pending: "hover:bg-amber-50",
  accepted: "hover:bg-emerald-50",
  cancelled: "hover:bg-red-50",
};

export function PaymentStatusSelector({ paymentId, currentStatus }: PaymentStatusSelectorProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

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
          description: `La orden cambió a "${statusLabels[newStatus] ?? newStatus}".`,
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

  const badgeClass = statusStyles[status] ?? statusStyles.pending;

  return (
    <div className="relative inline-flex items-center gap-2" ref={dropdownRef}>
      {/* Read-only status badge */}
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}
      >
        {statusLabels[status] ?? status}
      </span>

      {/* Edit pencil button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isLoading}
        aria-label="Editar estado de la orden"
        aria-expanded={isOpen}
        className="flex items-center justify-center w-7 h-7 rounded-full border border-tan/40 bg-card text-brown/60 hover:bg-olive hover:text-cream hover:border-olive transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Pencil size={13} />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-card border border-tan/30 rounded-2xl shadow-lg py-1 min-w-[160px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          role="listbox"
          aria-label="Seleccionar estado"
        >
          {Object.entries(statusLabels).map(([value, label]) => {
            const isActive = value === status;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleStatusChange(value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left transition-colors ${
                  isActive ? "bg-tan/10 font-semibold" : ""
                } ${optionHoverStyles[value] ?? ""}`}
              >
                <span
                  className={`w-2 h-2 rounded-full border ${statusStyles[value]}`}
                  aria-hidden="true"
                />
                <span className="text-brown">{label}</span>
                {isActive && (
                  <span className="ml-auto text-olive text-[10px]">actual</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
