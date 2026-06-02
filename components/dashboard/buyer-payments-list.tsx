import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { PaymentOrder } from "@/lib/generated/prisma";
import { Pagination } from "@/components/ui/pagination";

interface BuyerPaymentsListProps {
  payments: PaymentOrder[];
  totalPages: number;
  currentPage: number;
}

export function BuyerPaymentsList({
  payments,
  totalPages,
  currentPage,
}: BuyerPaymentsListProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-card rounded-3xl border border-tan overflow-hidden shadow-sm">
        <div className="divide-y divide-tan/30">
          {payments.map((payment) => (
            <Link
              key={payment.id}
              href={`/dashboard/payments/${payment.id}`}
              className="flex items-center justify-between p-6 hover:bg-background transition-colors group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium text-brown group-hover:text-red-900">
                  ${payment.amount.toFixed(2)}
                </span>
                <span className="text-[10px] tracking-widest text-brown/70 uppercase">
                  Orden #{payment.id}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="hidden sm:inline text-xs text-brown/70">
                  {payment.createdAt.toLocaleDateString("es-AR")}
                </span>
                <StatusBadge status={payment.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
