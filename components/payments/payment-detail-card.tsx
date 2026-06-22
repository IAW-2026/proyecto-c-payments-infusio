import { PaymentOrder } from "@/lib/generated/prisma";
import { translateMpStatus, translateMpStatusDetail } from "@/lib/mp-status-utils";

interface PaymentDetailCardProps {
  payment: PaymentOrder;
}

export function PaymentDetailCard({ payment }: PaymentDetailCardProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order Info */}
        <div className="bg-card rounded-2xl border border-tan/30 p-6 space-y-4">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase font-medium">
            Información de la Orden
          </h2>
          <dl className="space-y-4">
            <DetailRow label="ID interno" value={payment.id.toString()} mono />
            <DetailRow
              label="MercadoPago ID"
              value={payment.mercadoPagoId ?? "—"}
              mono
            />
            <DetailRow
              label="Nº Orden"
              value={payment.sellerAppOrderId}
              mono
            />
          </dl>
        </div>

        {/* Payment Info */}
        <div className="bg-card rounded-2xl border border-tan/30 p-6 space-y-4">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase font-medium">
            Datos del Pago
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Comprador" value={payment.buyerId} mono />
            <DetailRow
              label="Monto"
              value={`$${payment.amount.toFixed(2)}`}
              bold
            />
            <DetailRow
              label="Creado"
              value={payment.createdAt.toLocaleString("es-AR")}
            />
            <DetailRow
              label="Actualizado"
              value={payment.updatedAt.toLocaleString("es-AR")}
            />
          </dl>
        </div>
      </div>

      {/* Mercado Pago Provider Details */}
      {payment.mpStatus && (
        <div className="mt-6 bg-card rounded-2xl border border-tan/30 p-6 space-y-4">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase font-medium">
            Detalle del Proveedor (Mercado Pago)
          </h2>
          <dl className="space-y-4">
            <DetailRow
              label="Estado original"
              value={`${translateMpStatus(payment.mpStatus)} (${payment.mpStatus})`}
            />
            {payment.mpStatusDetail && (
              <DetailRow
                label="Detalle del estado"
                value={translateMpStatusDetail(payment.mpStatusDetail)}
              />
            )}
          </dl>
        </div>
      )}
    </>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  bold = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4 py-1 border-b border-tan/10 last:border-0">
      <dt className="text-xs text-brown/75 shrink-0">{label}</dt>
      <dd
        className={`text-sm text-brown text-right break-all ${mono ? "font-mono" : ""} ${bold ? "text-lg font-semibold text-olive" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
