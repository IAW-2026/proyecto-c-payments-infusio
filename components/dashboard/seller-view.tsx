import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart } from "@/components/ui/bar-chart";
import { Banknote, ShoppingBag, Percent } from "lucide-react";
import Link from "next/link";

import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

interface SellerViewProps {
  sellerId: string;
  page?: number;
}

export async function SellerView({ sellerId, page = 1 }: SellerViewProps) {
  const skip = (page - 1) * PAGE_SIZE;

  const [payments, totalCount, allPaymentsForStats] = await Promise.all([
    prisma.paymentOrder.findMany({
      where: { sellerAppId: sellerId },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: PAGE_SIZE,
    }),
    prisma.paymentOrder.count({ where: { sellerAppId: sellerId } }),
    prisma.paymentOrder.findMany({
      where: { sellerAppId: sellerId },
      select: { amount: true, createdAt: true, status: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const totalRevenue = allPaymentsForStats
    .filter((p) => p.status === "accepted")
    .reduce((acc, p) => acc + p.amount, 0);
  
  const totalOrders = totalCount;
  const approvedOrders = allPaymentsForStats.filter((p) => p.status === "accepted").length;
  const conversionRate = totalOrders > 0 ? Math.round((approvedOrders / totalOrders) * 100) : 0;

  // Daily Sales Data (Last 7 days)
  const dailyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("es-AR", { weekday: "short" });
    const dateStr = d.toLocaleDateString("en-CA");
    
    const value = allPaymentsForStats
      .filter((p) => p.status === "accepted" && p.createdAt.toLocaleDateString("en-CA") === dateStr)
      .reduce((acc, p) => acc + p.amount, 0);
    
    return { label, value };
  });

  // Monthly Sales Data (Rolling 6 months)
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

  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs tracking-[0.3em] text-terracotta italic mb-4 uppercase">
          Panel de Vendedor
        </p>
        <h1 className="font-serif text-5xl text-brown mb-2">Mi Tienda</h1>
        <p className="text-sm text-muted-foreground italic">
          Gestionando ventas para <span className="text-olive font-bold">{sellerId}</span>.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Ventas Totales"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={Banknote}
        />
        <StatCard
          label="Tasa de Conversión"
          value={`${conversionRate}%`}
          icon={Percent}
        />
        <StatCard
          label="Órdenes Recibidas"
          value={totalOrders}
          icon={ShoppingBag}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart label="Ventas últimos 7 días" data={dailyData} color="primary" />
        <BarChart label="Ventas por Mes" data={monthlyData} color="primary" />
      </div>

      {/* Sales Table */}
      <div className="bg-card rounded-3xl border border-tan overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-tan/30">
                <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">ID Interno</th>
                <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Ref. Tienda</th>
                <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Monto</th>
                <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Comprador</th>
                <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Fecha / Hora</th>
                <th className="px-6 py-4 text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tan/20">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-[10px] font-mono text-muted-foreground">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-brown">
                    {payment.sellerAppOrderId}
                  </td>
                  <td className="px-6 py-4 font-medium text-brown">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-[10px] text-muted-foreground font-mono">
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
  );
}
