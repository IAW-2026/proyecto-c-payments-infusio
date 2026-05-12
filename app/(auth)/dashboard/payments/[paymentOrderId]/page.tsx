import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentStatusSelector } from "./status-selector";

type PaymentDetailPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentOrderId } = await params;

  const payment = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
  });

  if (!payment) {
    notFound();
  }

  return (
    <div>
      
      <nav className="flex items-center gap-2 text-sm text-brown/50 mb-6">
        <Link href="/dashboard" className="hover:text-olive transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href="/dashboard/payments"
          className="hover:text-olive transition-colors"
        >
          Payments
        </Link>
        <span>/</span>
        <span className="text-brown font-mono">
          #{payment.id}
        </span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-brown">Payment Detail</h1>
        <PaymentStatusSelector paymentId={payment.id} currentStatus={payment.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl border border-tan/30 p-6">
          <h2 className="text-sm font-semibold text-brown mb-4">
            Order Information
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Payment Order ID" value={payment.id.toString()} mono />
            <DetailRow
              label="Mercado Pago ID"
              value={payment.mercadoPagoId ?? "—"}
              mono
            />
            <DetailRow label="Seller App ID" value={payment.sellerAppId} />
            <DetailRow
              label="Seller Order ID"
              value={payment.sellerAppOrderId}
              mono
            />
          </dl>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl border border-tan/30 p-6">
          <h2 className="text-sm font-semibold text-brown mb-4">
            Payment Details
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Buyer App ID" value={payment.buyerAppId} />
            <DetailRow label="Buyer ID" value={payment.buyerId} mono />
            <DetailRow
              label="Amount"
              value={`$${payment.amount.toFixed(2)}`}
              bold
            />
            <DetailRow
              label="Created"
              value={payment.createdAt.toLocaleString()}
            />
            <DetailRow
              label="Updated"
              value={payment.updatedAt.toLocaleString()}
            />
          </dl>
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
    <div className="flex justify-between items-center">
      <dt className="text-sm text-brown/60">{label}</dt>
      <dd
        className={`text-sm text-brown ${mono ? "font-mono" : ""} ${bold ? "text-lg font-semibold" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
