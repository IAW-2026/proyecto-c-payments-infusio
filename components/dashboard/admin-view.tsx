import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Banknote, TrendingUp, ShoppingBag, BarChart3 } from "lucide-react";
import Link from "next/link";

import { BarChart } from "@/components/ui/bar-chart";
import { RankingList } from "@/components/ui/ranking-list";
import { Pagination } from "@/components/ui/pagination";
import { ExportButton } from "@/components/ui/export-button";

const PAGE_SIZE = 10;

export async function AdminView({ page = 1 }: { page?: number }) {
  const skip = (page - 1) * PAGE_SIZE;

  const [total, approved, pending, revenue, recentPayments, totalPaymentsCount, allAcceptedPayments] = await Promise.all([
    prisma.paymentOrder.count(),
    prisma.paymentOrder.count({ where: { status: "accepted" } }),
    prisma.paymentOrder.count({ where: { status: "pending" } }),
    prisma.paymentOrder.aggregate({
      _sum: { amount: true },
      where: { status: "accepted" },
    }),
    prisma.paymentOrder.findMany({
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: PAGE_SIZE,
    }),
    prisma.paymentOrder.count(),
    prisma.paymentOrder.findMany({
      where: { status: "accepted" },
      select: { amount: true, createdAt: true, sellerAppId: true },
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

  // Top Sellers Ranking (by Revenue)
  const sellerTotals: Record<string, number> = {};
  allAcceptedPayments.forEach((p) => {
    sellerTotals[p.sellerAppId] = (sellerTotals[p.sellerAppId] || 0) + p.amount;
  });

  const topSellersData = Object.entries(sellerTotals)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 stores

  return (
    <div className="space-y-12">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-terracotta italic mb-4 uppercase">
            Administración Global
          </p>
          <h1 className="font-serif text-5xl text-brown mb-2">Panel Maestro</h1>
          <p className="text-sm text-muted-foreground italic">
            Resumen total de la red Infusio.
          </p>
        </div>
        <div className="pt-8">
          <ExportButton data={recentPayments} />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Volumen Total (GMV)"
          value={`$${totalVolume.toLocaleString()}`}
          icon={Banknote}
        />
        <StatCard
          label="Órdenes Totales"
          value={total}
          icon={ShoppingBag}
        />
        <StatCard
          label="Tasa de Éxito"
          value={`${successRate}%`}
          icon={TrendingUp}
          trend={{ value: 2.5, label: "este mes", isPositive: true }}
        />
        <StatCard
          label="Pendientes"
          value={pending}
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart label="Ingresos Globales (Últimos 6 meses)" data={monthlyRevenueData} color="accent" />
        <RankingList title="Ranking de Tiendas (por Volumen)" data={topSellersData} />
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <div className="bg-card rounded-3xl border border-tan overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-tan/30">
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">ID Interno</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">MP Payment ID</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Ref. Tienda</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Monto</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Tienda</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Comprador</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Fecha / Hora</th>
                  <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tan/20">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-background transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/payments/${payment.id}`} className="text-[10px] font-mono text-muted-foreground group-hover:text-terracotta">
                        {payment.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-brown/60">
                      {payment.mercadoPagoId || "—"}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-brown">
                      {payment.sellerAppOrderId}
                    </td>
                    <td className="px-6 py-4 font-medium text-brown whitespace-nowrap">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-olive font-bold">
                      {payment.sellerAppId}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-muted-foreground font-mono truncate max-w-[120px]" title={payment.buyerId}>
                      {payment.buyerId}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-muted-foreground whitespace-nowrap">
                      {payment.createdAt.toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
