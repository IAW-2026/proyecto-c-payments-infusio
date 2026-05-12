"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

type PaymentData = {
  id: number;
  mercadoPagoId: string | null;
  sellerAppOrderId: string;
  amount: number;
  status: string;
};

export function ExportButton({ data }: { data: PaymentData[] }) {
  const handleExport = () => {
    try {
      const headers = ["ID", "MercadoPago ID", "Order ID", "Amount", "Status"];
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          [
            row.id,
            row.mercadoPagoId || "N/A",
            row.sellerAppOrderId,
            row.amount,
            row.status,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `reporte_infusio_${new Date().getTime()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reporte CSV exportado", {
        description: "El archivo se ha descargado correctamente.",
      });
    } catch (error) {
      toast.error("Error al exportar", {
        description: "Hubo un problema al generar el CSV.",
      });
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-olive text-cream rounded-full text-xs font-medium hover:bg-olive/90 transition-colors shadow-sm"
    >
      <Download size={14} />
      Exportar CSV
    </button>
  );
}
