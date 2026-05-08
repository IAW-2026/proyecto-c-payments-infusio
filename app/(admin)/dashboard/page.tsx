import { prisma } from "@/lib/prisma";

export default async function DashboardOverviewPage() {
  const [total, approved, pending, revenue] = await Promise.all([
    prisma.paymentOrder.count(),
    prisma.paymentOrder.count({ where: { status: "accepted" } }),
    prisma.paymentOrder.count({ where: { status: "pending" } }),
    prisma.paymentOrder.aggregate({
      _sum: { amount: true },
      where: { status: "accepted" },
    }),
  ]);

  const recentPayments = await prisma.paymentOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Total Payments", value: total.toString() },
    { label: "Approved", value: approved.toString() },
    { label: "Pending", value: pending.toString() },
    {
      label: "Revenue",
      value: `$${(revenue._sum.amount ?? 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brown mb-1">Dashboard</h1>
      <p className="text-sm text-brown/60 mb-8">
        Overview of payment activity
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-tan/30 p-5"
          >
            <p className="text-xs text-brown/50 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-brown">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-tan/30 p-6">
        <h2 className="text-sm font-semibold text-brown mb-4">
          Recent Activity
        </h2>
        {recentPayments.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-brown/30 text-sm">
            No payment activity yet. Payments will appear here once
            processed.
          </div>
        ) : (
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <a
                key={payment.id}
                href={`/dashboard/payments/${payment.id}`}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-brown/50">
                    #{payment.id}
                  </span>
                  <span className="text-sm text-brown">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={payment.status} />
                  <span className="text-xs text-brown/40">
                    {payment.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
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
