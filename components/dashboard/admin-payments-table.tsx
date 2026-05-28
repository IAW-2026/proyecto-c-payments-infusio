import Link from "next/link";
import { Eye } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PaymentOrder } from "@/lib/generated/prisma";
import { Pagination } from "@/components/ui/pagination";

interface AdminPaymentsTableProps {
  payments: PaymentOrder[];
  status?: string;
  totalPages: number;
  currentPage: number;
}

export function AdminPaymentsTable({
  payments,
  status,
  totalPages,
  currentPage,
}: AdminPaymentsTableProps) {
  const filterButtons = [
    { label: "Todos", value: undefined },
    { label: "Pendientes", value: "pending" },
    { label: "Aceptados", value: "accepted" },
    { label: "Cancelados", value: "cancelled" },
  ];

  return (
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
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  isActive
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
              {payments.map((payment) => (
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
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
