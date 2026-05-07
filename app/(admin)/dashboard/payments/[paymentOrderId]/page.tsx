import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PaymentDetailPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

// Next.js requires default export for pages
// eslint-disable-next-line import/no-default-export
export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentOrderId } = await params;

  const payment = await prisma.paymentOrder.findUnique({
    where: { id: paymentOrderId },
  });

  if (!payment) {
    notFound();
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-tan/30 text-brown",
    accepted: "bg-olive/10 text-olive",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div>
      {/* Breadcrumb */}
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
          {payment.id.slice(0, 12)}...
        </span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-brown">Payment Detail</h1>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[payment.status] ?? statusStyles.pending}`}
        >
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl border border-tan/30 p-6">
          <h2 className="text-sm font-semibold text-brown mb-4">
            Order Information
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Payment Order ID" value={payment.id} mono />
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
