import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type MyPaymentDetailPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

export default async function MyPaymentDetailPage({
  params,
}: MyPaymentDetailPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { paymentOrderId } = await params;

  const payment = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
  });

  if (!payment || payment.buyerId !== userId) {
    notFound();
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-tan/30 text-brown",
    accepted: "bg-olive/10 text-olive",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-brown/50 mb-8">
        <Link href="/my-payments" className="hover:text-olive transition-colors">
          My Payments
        </Link>
        <span>/</span>
        <span className="text-brown font-mono">#{payment.id}</span>
      </nav>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-brown">Payment Detail</h1>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[payment.status] ?? statusStyles.pending}`}
        >
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-tan/30 p-8 shadow-sm space-y-6">
        <DetailRow label="Order Number" value={`#${payment.id}`} mono />
        <DetailRow
          label="Amount"
          value={`$${payment.amount.toFixed(2)}`}
          bold
        />
        <DetailRow label="Date" value={payment.createdAt.toLocaleString()} />
        <DetailRow label="Last Updated" value={payment.updatedAt.toLocaleString()} />
        <DetailRow label="Store Reference" value={payment.sellerAppOrderId} mono />
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
    <div className="flex justify-between items-center border-b border-tan/10 pb-4 last:border-0 last:pb-0">
      <span className="text-sm text-brown/60">{label}</span>
      <span
        className={`text-sm text-brown ${mono ? "font-mono" : ""} ${bold ? "text-xl font-semibold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
