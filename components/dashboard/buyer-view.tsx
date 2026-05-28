import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActivityCalendar } from "@/components/ui/activity-calendar";
import { BarChart } from "@/components/ui/bar-chart";
import { CreditCard, Clock, Package, ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatGrid, type StatItem } from "@/components/dashboard/stat-grid";
import { BuyerPaymentsList } from "@/components/dashboard/buyer-payments-list";

const PAGE_SIZE = 10;

interface BuyerViewProps {
  userId: string;
  page?: number;
}

export async function BuyerView({ userId, page = 1 }: BuyerViewProps) {
  const skip = (page - 1) * PAGE_SIZE;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [payments, totalCount, allPaymentsForStats] = await Promise.all([
    prisma.paymentOrder.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: PAGE_SIZE,
    }),
    prisma.paymentOrder.count({ where: { buyerId: userId } }),
    prisma.paymentOrder.findMany({
      where: { buyerId: userId, createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, createdAt: true, status: true },
    }),
  ]);

  // Empty state: buyer has no purchases yet
  if (totalCount === 0) {
    return (
      <div className="space-y-12">
        <DashboardHeader
          eyebrow="Tu Actividad"
          title="Mis Compras"
          description="Historial detallado de tus transacciones."
        />
        <EmptyState
          icon={ShoppingBag}
          title="Aún no tenés compras"
          description="Cuando realices tu primera compra en Infusio, vas a poder ver acá el detalle y el estado de todos tus pagos."
          actionLabel="Explorar la Tienda"
          actionHref={process.env.SELLER_APP_URL || "http://localhost:3001"}
        />
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const totalSpent = allPaymentsForStats
    .filter(p => p.status === "accepted")
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingCount = allPaymentsForStats.filter(p => p.status === "pending").length;
  const totalOrders = totalCount;

  // Monthly Spending Data (Rolling 6 months)
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const label = monthNames[m];

    const spent = allPaymentsForStats
      .filter((p) => p.status === "accepted" && p.createdAt.getMonth() === m && p.createdAt.getFullYear() === y)
      .reduce((acc, p) => acc + p.amount, 0);

    return { label, value: spent };
  });

  const activityData = Array.from({ length: 28 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    const dateStr = date.toLocaleDateString("en-CA");
    const count = allPaymentsForStats.filter(
      (p) => p.createdAt.toLocaleDateString("en-CA") === dateStr
    ).length;
    return { date: dateStr, count };
  });

  const stats: StatItem[] = [
    { label: "Total Gastado", value: `$${totalSpent.toLocaleString()}`, icon: CreditCard },
    { label: "Pendientes", value: pendingCount, icon: Clock },
    { label: "Total Órdenes", value: totalOrders, icon: Package },
  ];

  return (
    <div className="space-y-12">
      <DashboardHeader
        eyebrow="Tu Actividad"
        title="Mis Compras"
        description="Historial detallado de tus transacciones."
      />

      <StatGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <ActivityCalendar data={activityData} />
          <BarChart label="Gasto Mensual" data={monthlyData} color="accent" />
        </div>

        <BuyerPaymentsList
          payments={payments}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </div>
  );
}
