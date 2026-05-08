import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function MyPaymentsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const payments = await prisma.paymentOrder.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-brand text-3xl text-brown mb-2">My Payments</h1>
      <p className="text-sm text-brown/60 mb-8">
        Your payment history in the Infusio Marketplace.
      </p>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-tan/30 p-12 text-center text-brown/50 text-sm">
          You haven't made any payments yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
          <div className="divide-y divide-tan/20">
            {payments.map((payment) => (
              <Link
                key={payment.id}
                href={`/my-payments/${payment.id}`}
                className="flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brown">
                    ${payment.amount.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-brown/50">
                    Order #{payment.id}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-brown/50">
                    {payment.createdAt.toLocaleDateString()}
                  </span>
                  <StatusBadge status={payment.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-tan/30 text-brown",
    accepted: "bg-olive/10 text-olive",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] ?? styles.pending}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
