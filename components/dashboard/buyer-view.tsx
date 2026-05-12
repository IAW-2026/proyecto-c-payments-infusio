import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActivityCalendar } from "@/components/ui/activity-calendar";
import { BarChart } from "@/components/ui/bar-chart";
import { CreditCard, Clock, Package } from "lucide-react";

import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

interface BuyerViewProps {
  userId: string;
  page?: number;
}

export async function BuyerView({ userId, page = 1 }: BuyerViewProps) {
  const skip = (page - 1) * PAGE_SIZE;

  const [payments, totalCount, allPaymentsForStats] = await Promise.all([
    prisma.paymentOrder.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: PAGE_SIZE,
    }),
    prisma.paymentOrder.count({ where: { buyerId: userId } }),
    prisma.paymentOrder.findMany({
      where: { buyerId: userId },
      select: { amount: true, createdAt: true, status: true },
    }),
  ]);

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

  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs tracking-[0.3em] text-terracotta italic mb-4 uppercase">
          Tu Actividad
        </p>
        <h1 className="font-serif text-5xl text-brown mb-2">Mis Compras</h1>
        <p className="text-sm text-muted-foreground italic">
          Historial detallado de tus transacciones.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Total Gastado"
          value={`$${totalSpent.toLocaleString()}`}
          icon={CreditCard}
        />
        <StatCard
          label="Pendientes"
          value={pendingCount}
          icon={Clock}
        />
        <StatCard
          label="Total Órdenes"
          value={totalOrders}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <ActivityCalendar data={activityData} />
          <BarChart label="Gasto Mensual" data={monthlyData} color="accent" />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-3xl border border-tan overflow-hidden shadow-sm">
            <div className="divide-y divide-tan/30">
              {payments.map((payment) => (
                <Link
                  key={payment.id}
                  href={`/my-payments/${payment.id}`}
                  className="flex items-center justify-between p-6 hover:bg-background transition-colors group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium text-brown group-hover:text-terracotta">
                      ${payment.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                      Orden #{payment.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="hidden sm:inline text-xs text-muted-foreground">
                      {payment.createdAt.toLocaleDateString("es-AR")}
                    </span>
                    <StatusBadge status={payment.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  );
}
