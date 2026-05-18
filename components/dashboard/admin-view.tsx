import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Banknote, TrendingUp, ShoppingBag, BarChart3, Eye } from "lucide-react";
import Link from "next/link";

import { BarChart } from "@/components/ui/bar-chart";
import { Pagination } from "@/components/ui/pagination";
import { ExportButton } from "@/components/ui/export-button";

const PAGE_SIZE = 10;

export async function AdminView({ page = 1, status }: { page?: number; status?: string }) {
  const skip = (page - 1) * PAGE_SIZE;

  const validStatuses: PaymentStatus[] = ["pending", "accepted", "cancelled"];
  const filterClause = validStatuses.includes(status as PaymentStatus)
    ? { status: status as PaymentStatus }
    : {};

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
      where: { status: "accepted" },
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

  const filterButtons = [
    { label: "Todos", value: undefined },
    { label: "Pendientes", value: "pending" },
    { label: "Aceptados", value: "accepted" },
    { label: "Cancelados", value: "cancelled" },
  ];



  return (
    <div className="space-y-12">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-red-900 italic mb-4 uppercase">
            Administración Global
          </p>
          <h1 className="font-serif text-5xl text-brown mb-2">Panel Maestro</h1>
          <p className="text-sm text-brown/70 italic">
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

      <BarChart label="Ingresos Globales (Últimos 6 meses)" data={monthlyRevenueData} color="accent" />

      {/* Table Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
          <h2 className="text-xl font-serif text-brown">Órdenes y Pagos</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {filterButtons.map((btn) => {
              const isActive = status === btn.value || (!status && !btn.value);
              const href = btn.value
                ? `/dashboard?status=${btn.value}`
                : "/dashboard";
              return (
                <Link
                  key={btn.label}
                  href={href}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${isActive
                      ? "bg-olive text-cream"
                      : "text-brown/80 border border-tan/30 hover:bg-tan/10"
                    }`}
                >
                  {btn.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-tan overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">Lista de pagos recientes en el sistema</caption>
              <thead>
                <tr className="bg-muted/30 border-b border-tan/30">
                  <th scope="col" className="hidden xl:table-cell px-6 py-4 text-[10px] tracking-widest text-brown/70 uppercase whitespace-nowrap">MP Payment ID</th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-4 text-[10px] tracking-widest text-brown/70 uppercase whitespace-nowrap">Nº Orden</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-[10px] tracking-widest text-brown/70 uppercase whitespace-nowrap">Monto</th>
                  <th scope="col" className="hidden md:table-cell px-6 py-4 text-[10px] tracking-widest text-brown/70 uppercase whitespace-nowrap">Comprador</th>
                  <th scope="col" className="hidden lg:table-cell px-6 py-4 text-[10px] tracking-widest text-brown/70 uppercase whitespace-nowrap">Fecha / Hora</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-[10px] tracking-widest text-brown/70 uppercase whitespace-nowrap">Estado</th>
                  <th scope="col" className="px-4 sm:px-6 py-4"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tan/20">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-background transition-colors group">
                    <td className="hidden xl:table-cell px-6 py-4 text-[10px] font-mono text-brown/80">
                      {payment.mercadoPagoId || "—"}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-xs font-medium text-brown">
                      {payment.sellerAppOrderId}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-medium text-brown whitespace-nowrap">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-[10px] text-brown/70 font-mono truncate max-w-[120px]" title={payment.buyerId}>
                      {payment.buyerId.slice(0, 8)}...
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-[10px] text-brown/70 whitespace-nowrap">
                      {payment.createdAt.toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Link
                        href={`/dashboard/payments/${payment.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-tan/20 text-brown hover:bg-olive hover:text-cream transition-colors"
                      >
                        <Eye size={12} />
                        Ver
                      </Link>
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
