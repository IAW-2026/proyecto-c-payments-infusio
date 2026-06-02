import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type CheckoutPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { paymentOrderId } = await params;
  const { userId } = await auth();

  const payment = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
  });

  if (!payment) {
    notFound();
  }

  if (!userId || userId !== payment.buyerId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="font-brand text-2xl text-brown mb-3">
            Access Denied
          </h1>
          <p className="text-sm text-brown/60">
            You are not authorized to view this payment order.
            Only the original buyer can access this checkout.
          </p>
        </div>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-tan/30 text-brown",
    accepted: "bg-olive/10 text-olive",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-olive mb-4">
        Checkout
      </p>
      <h1 className="font-brand text-3xl text-brown mb-6">
        Complete Your Payment
      </h1>

      <div className="bg-white rounded-2xl border border-tan/30 p-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-tan/20">
            <span className="text-sm text-brown/60">Payment Order</span>
            <span className="text-sm font-mono text-brown">
              #{payment.id}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-tan/20">
            <span className="text-sm text-brown/60">Amount</span>
            <span className="text-2xl font-semibold text-brown">
              ${payment.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brown/60">Status</span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[payment.status] ?? statusStyles.pending}`}
            >
              {payment.status.charAt(0).toUpperCase() +
                payment.status.slice(1)}
            </span>
          </div>
        </div>

        {payment.status === "pending" ? (
          <>
            <button
              disabled
              className="mt-8 w-full py-3.5 bg-olive text-cream rounded-full font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Please use the checkout link provided to your app.
            </button>
          </>
        ) : (
          <div className="mt-8 text-center text-sm text-brown/60">
            This payment has already been{" "}
            {payment.status === "accepted" ? "completed" : "cancelled"}.
          </div>
        )}
      </div>
    </div>
  );
}

