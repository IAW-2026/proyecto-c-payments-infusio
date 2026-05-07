import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";

type PaymentsListPageProps = {
  searchParams: Promise<{ status?: string }>;
};

// Next.js requires default export for pages
// eslint-disable-next-line import/no-default-export
export default async function PaymentsListPage({
  searchParams,
}: PaymentsListPageProps) {
  const params = await searchParams;
  const statusFilter = params.status as PaymentStatus | undefined;

  const validStatuses: PaymentStatus[] = ["pending", "accepted", "cancelled"];
  const whereClause = validStatuses.includes(statusFilter as PaymentStatus)
    ? { status: statusFilter as PaymentStatus }
    : {};

  const payments = await prisma.paymentOrder.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  const filterButtons = [
    { label: "All", value: undefined },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brown mb-1">Payments</h1>
      <p className="text-sm text-brown/60 mb-8">
        All payment orders in the system
      </p>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {filterButtons.map((btn) => {
          const isActive = statusFilter === btn.value || (!statusFilter && !btn.value);
          const href = btn.value
            ? `/dashboard/payments?status=${btn.value}`
            : "/dashboard/payments";
          return (
            <Link
              key={btn.label}
              href={href}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${
                isActive
                  ? "bg-olive text-cream"
                  : "text-brown/60 border border-tan/30 hover:bg-tan/10"
              }`}
            >
              {btn.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-tan/20">
              <th className="text-left px-6 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">
                Buyer
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-brown/30 text-sm"
                >
                  No payment orders found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-tan/10 hover:bg-cream/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-brown">
                    <Link
                      href={`/dashboard/payments/${payment.id}`}
                      className="hover:text-olive transition-colors"
                    >
                      {payment.id.slice(0, 12)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-brown/70">
                    {payment.buyerId.slice(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-brown">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-brown/50">
                    {payment.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
