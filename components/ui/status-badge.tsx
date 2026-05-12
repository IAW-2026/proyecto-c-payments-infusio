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
    className: "bg-tan/20 text-brown border-tan",
  },
  accepted: {
    label: "Aceptado",
    className: "bg-olive/10 text-olive border-olive/20",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-terracotta/10 text-terracotta border-terracotta/20",
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
