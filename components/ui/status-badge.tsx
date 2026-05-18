import { PaymentStatus } from "@/lib/generated/prisma";

interface StatusBadgeProps {
  status: PaymentStatus;
}

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-900 border-amber-300",
  },
  accepted: {
    label: "Aceptado",
    className: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-900 border-red-300",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
