import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PaymentStatusPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

// Next.js requires default export for pages
// eslint-disable-next-line import/no-default-export
export default async function PaymentStatusPage({
  params,
}: PaymentStatusPageProps) {
  const { paymentOrderId } = await params;

  const payment = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
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
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-olive mb-4">
        Payment Status
      </p>
      <h1 className="font-brand text-3xl text-brown mb-8">Order Details</h1>

      <div className="bg-white rounded-2xl border border-tan/30 p-8 shadow-sm space-y-5">
        <div className="flex justify-between items-center pb-4 border-b border-tan/20">
          <span className="text-sm text-brown/60">Payment Order ID</span>
          <span className="text-sm font-mono text-brown">
            #{payment.id}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-tan/20">
          <span className="text-sm text-brown/60">Status</span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[payment.status] ?? statusStyles.pending}`}
          >
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-tan/20">
          <span className="text-sm text-brown/60">Amount</span>
          <span className="text-lg font-semibold text-brown">
            ${payment.amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-brown/60">Created</span>
          <span className="text-sm text-brown/60">
            {payment.createdAt.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
