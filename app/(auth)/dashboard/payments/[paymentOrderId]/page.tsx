import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PaymentStatusSelector } from "./status-selector";
import { StatusBadge } from "@/components/ui/status-badge";
import { BackButton } from "@/components/ui/back-button";
import { PaymentDetailCard } from "@/components/payments/payment-detail-card";

type PaymentDetailPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentOrderId } = await params;
  const { sessionClaims, userId } = await auth();
  const isAdmin = sessionClaims?.metadata?.role === "admin";

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <BackButton label="Volver al dashboard" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-terracotta italic mb-1 uppercase">
            Orden de Pago
          </p>
          <h1 className="font-serif text-4xl text-brown">
            #{payment.id}
          </h1>
        </div>
        <div>
          {isAdmin ? (
            <PaymentStatusSelector
              paymentId={payment.id}
              currentStatus={payment.status}
            />
          ) : (
            <StatusBadge status={payment.status} />
          )}
        </div>
      </div>

      <PaymentDetailCard payment={payment} />
    </div>
  );
}

