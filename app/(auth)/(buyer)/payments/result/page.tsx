import Link from "next/link";
import { SuccessConfetti } from "@/components/ui/success-confetti";

type ResultPageProps = {
  searchParams: Promise<{
    status?: string;
    payment_id?: string;
    external_reference?: string;
  }>;
};

export default async function PaymentResultPage({ searchParams }: ResultPageProps) {
  const { status, external_reference: paymentOrderId } = await searchParams;

  const statusConfig: Record<
    string,
    { title: string; description: string; color: string; icon: string }
  > = {
    approved: {
      title: "Payment Approved",
      description:
        "Your payment has been processed successfully. You will receive a confirmation shortly.",
      color: "text-olive",
      icon: "✓",
    },
    pending: {
      title: "Payment Pending",
      description:
        "Your payment is being processed. We will notify you once it is confirmed.",
      color: "text-terracotta",
      icon: "⏳",
    },
    failure: {
      title: "Payment Failed",
      description:
        "Something went wrong with your payment. Please try again or use a different payment method.",
      color: "text-red-600",
      icon: "✕",
    },
    rejected: {
      title: "Payment Rejected",
      description:
        "Your payment was rejected by the processor. Please try again or use a different payment method.",
      color: "text-red-600",
      icon: "✕",
    },
    in_process: {
      title: "Payment Processing",
      description:
        "Your payment is being processed. We will notify you once it is confirmed.",
      color: "text-terracotta",
      icon: "⏳",
    },
    cancelled: {
      title: "Payment Cancelled",
      description:
        "The payment process was cancelled or has expired.",
      color: "text-brown/60",
      icon: "—",
    },
  };

  const config = statusConfig[status ?? ""] ?? {
    title: "Checkout Incomplete",
    description: "You haven't completed the payment yet. You can try again whenever you are ready.",
    color: "text-brown/60",
    icon: "↺",
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-alt/30 ${config.color} text-3xl mb-6`}
      >
        {config.icon}
      </div>
      <h1 className={`font-brand text-3xl mb-3 ${config.color}`}>
        {config.title}
      </h1>
      <p className="text-brown/60 leading-relaxed mb-8">{config.description}</p>

      {status === "approved" && <SuccessConfetti />}
      
      {paymentOrderId && (
        <p className="text-xs text-brown/40 mb-6">
          Payment Order:{" "}
          <span className="font-mono">{paymentOrderId}</span>
        </p>
      )}

      <Link
        href="/"
        className="inline-block px-6 py-3 bg-olive text-cream rounded-full text-sm font-medium hover:bg-olive/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}


