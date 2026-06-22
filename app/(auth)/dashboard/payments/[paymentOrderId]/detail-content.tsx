import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentStatusSelector } from "./status-selector";
import { StatusBadge } from "@/components/ui/status-badge";
import { PaymentDetailCard } from "@/components/payments/payment-detail-card";

interface PaymentDetailContentProps {
  paymentOrderId: string;
  userId: string | null;
  isAdmin: boolean;
}

export async function PaymentDetailContent({
  paymentOrderId,
  userId,
  isAdmin,
}: PaymentDetailContentProps) {
  const payment = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
  });

  if (!payment) {
    notFound();
  }

  if (!isAdmin && payment.buyerId !== userId) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Align badge to the right side of the header */}
      <div className="flex justify-end -mt-16 md:-mt-20 mb-8 relative z-50">
        {isAdmin ? (
          <PaymentStatusSelector
            paymentId={payment.id}
            currentStatus={payment.status}
          />
        ) : (
          <StatusBadge status={payment.status} />
        )}
      </div>

      <PaymentDetailCard payment={payment} />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      {/* Badge placeholder */}
      <div className="flex justify-end -mt-16 md:-mt-20 mb-8">
        <div className="h-8 w-24 bg-tan/20 rounded-full" />
      </div>

      {/* Card grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-tan/30 p-6 space-y-4 h-64 flex flex-col justify-between">
            <div>
              <div className="h-4 w-32 bg-tan/30 rounded-md mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-tan/20 rounded-md" />
                    <div className="h-4 w-28 bg-tan/20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
