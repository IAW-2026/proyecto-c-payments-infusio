import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PaymentStatusSelector } from "./status-selector";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowLeft } from "lucide-react";

type PaymentDetailPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentOrderId } = await params;
  const { sessionClaims } = await auth();
  const isAdmin = sessionClaims?.metadata?.role === "admin";

  const payment = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
  });

  if (!payment) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-brown/50 hover:text-olive transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Volver al dashboard
      </Link>

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

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order Info */}
        <div className="bg-card rounded-2xl border border-tan/30 p-6 space-y-4">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase font-medium">
            Información de la Orden
          </h2>
          <DetailRow label="ID interno" value={payment.id.toString()} mono />
          <DetailRow
            label="MercadoPago ID"
            value={payment.mercadoPagoId ?? "—"}
            mono
          />
          <DetailRow
            label="Nº Orden"
            value={payment.sellerAppOrderId}
            mono
          />
        </div>

        {/* Payment Info */}
        <div className="bg-card rounded-2xl border border-tan/30 p-6 space-y-4">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase font-medium">
            Datos del Pago
          </h2>
          <DetailRow label="Comprador" value={payment.buyerId} mono />
          <DetailRow
            label="Monto"
            value={`$${payment.amount.toFixed(2)}`}
            bold
          />
          <DetailRow
            label="Creado"
            value={payment.createdAt.toLocaleString("es-AR")}
          />
          <DetailRow
            label="Actualizado"
            value={payment.updatedAt.toLocaleString("es-AR")}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  bold = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4 py-1 border-b border-tan/10 last:border-0">
      <dt className="text-xs text-brown/50 shrink-0">{label}</dt>
      <dd
        className={`text-sm text-brown text-right break-all ${mono ? "font-mono" : ""} ${bold ? "text-lg font-semibold text-olive" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

