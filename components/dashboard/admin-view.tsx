import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Banknote, TrendingUp, ShoppingBag, BarChart3, Eye } from "lucide-react";
import Link from "next/link";

import { BarChart } from "@/components/ui/bar-chart";
import { ExportButton } from "@/components/ui/export-button";
import { StatGrid, type StatItem } from "@/components/dashboard/stat-grid";
import { AdminPaymentsTable } from "@/components/dashboard/admin-payments-table";

const PAGE_SIZE = 10;

export async function AdminView({ page = 1, status }: { page?: number; status?: string }) {
  const skip = (page - 1) * PAGE_SIZE;

  const validStatuses: PaymentStatus[] = ["pending", "accepted", "cancelled"];
  const filterClause = validStatuses.includes(status as PaymentStatus)
    ? { status: status as PaymentStatus }
    : {};

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [total, approved, pending, revenue, recentPayments, totalPaymentsCount, allAcceptedPayments] = await Promise.all([
    prisma.paymentOrder.count(),
    prisma.paymentOrder.count({ where: { status: "accepted" } }),
    prisma.paymentOrder.count({ where: { status: "pending" } }),
    prisma.paymentOrder.aggregate({
      _sum: { amount: true },
      where: { status: "accepted" },
    }),
    prisma.paymentOrder.findMany({
      where: filterClause,
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: PAGE_SIZE,
    }),
    prisma.paymentOrder.count({ where: filterClause }),
    prisma.paymentOrder.findMany({
      where: { status: "accepted", createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, createdAt: true },
    }),
  ]);

  const totalPages = Math.ceil(totalPaymentsCount / PAGE_SIZE);
  const totalVolume = revenue._sum.amount ?? 0;
  const successRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Global Monthly Revenue (Rolling 6 months)
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const monthlyRevenueData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const label = monthNames[m];

    const value = allAcceptedPayments
      .filter((p) => p.createdAt.getMonth() === m && p.createdAt.getFullYear() === y)
      .reduce((acc, p) => acc + p.amount, 0);

    return { label, value };
  });

  const stats: StatItem[] = [
    { label: "Volumen Total (GMV)", value: `$${totalVolume.toLocaleString()}`, icon: Banknote },
    { label: "Órdenes Totales", value: total, icon: ShoppingBag },
    { label: "Tasa de Éxito", value: `${successRate}%`, icon: TrendingUp, trend: { value: 2.5, label: "este mes", isPositive: true } },
    { label: "Pendientes", value: pending, icon: BarChart3 },
  ];

  return (
    <div className="space-y-12">
      <StatGrid stats={stats} />

      <BarChart label="Ingresos Globales (Últimos 6 meses)" data={monthlyRevenueData} color="accent" />

      <AdminPaymentsTable
        payments={recentPayments}
        status={status}
        totalPages={totalPages}
        currentPage={page}
        exportButton={<ExportButton data={recentPayments} />}
      />
    </div>
  );
}
