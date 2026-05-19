import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

function mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
  const statusMap: Record<string, PaymentStatus> = {
    // Accepted
    approved: "accepted",
    processed: "accepted",

    // Pending
    pending: "pending",
    in_process: "pending",
    processing: "pending",
    in_review: "pending",
    created: "pending",
    action_required: "pending",

    // Cancelled / Failed
    rejected: "cancelled",
    failed: "cancelled",
    cancelled: "cancelled",
    canceled: "cancelled",
    refunded: "cancelled",
    charged_back: "cancelled",
    expired: "cancelled",
  };
  return statusMap[mpStatus] ?? "pending";
}

/**
 * POST /api/payments/webhook
 *
 * Receives payment notifications from Mercado Pago.
 * Does NOT use API key — validated by Mercado Pago's signature mechanism.
 */
function extractPaymentId(body: unknown, url: URL): string | null {
  const bodyDataId =
    typeof body === "object" &&
      body !== null &&
      "data" in body &&
      typeof (body as Record<string, unknown>).data === "object" &&
      (body as Record<string, unknown>).data !== null
      ? ((body as Record<string, Record<string, unknown>>).data.id as string | undefined)
      : undefined;

  return (
    bodyDataId ??
    url.searchParams.get("data.id") ??
    url.searchParams.get("id")
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const paymentId = extractPaymentId(body, url);

  console.log("🔔 Webhook recibido! ID detectado:", paymentId);
  console.log("📦 Body completo:", JSON.stringify(body, null, 2));

  if (!paymentId) {
    console.log("⚠️ Webhook ignorado: No se encontró un ID de pago.");
    return NextResponse.json({ ok: true });
  }

  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
    });
    const paymentClient = new Payment(client);

    const mpPayment = await paymentClient.get({ id: paymentId });

    if (!mpPayment || !mpPayment.status || !mpPayment.external_reference) {
      console.warn("Webhook ignored: Missing status or external_reference");
      return NextResponse.json({ ok: true });
    }

    const mappedStatus = mapMercadoPagoStatus(mpPayment.status);
    const rawStatusDetail = (mpPayment as { status_detail?: string }).status_detail;

    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { id: parseInt(mpPayment.external_reference, 10) },
    });

    if (paymentOrder) {
      await prisma.paymentOrder.update({
        where: { id: paymentOrder.id },
        data: {
          status: mappedStatus,
          mercadoPagoId: mpPayment.id?.toString(),
          mpStatus: mpPayment.status,
          mpStatusDetail: rawStatusDetail ?? null,
        },
      });
      console.log(`Payment ${paymentOrder.id} updated to ${mappedStatus} (MP ID: ${mpPayment.id})`);

      const sellerAppUrl = process.env.SELLER_APP_URL;
      if (sellerAppUrl) {
        try {
          const response = await fetch(`${sellerAppUrl}/api/orders/${paymentOrder.sellerAppOrderId}/payment-confirmed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.PAYMENTS_API_KEY || "",
            },
            body: JSON.stringify({
              payment_order_id: paymentOrder.id,
              status: mappedStatus,
            }),
          });
          if (!response.ok) {
            console.error(`Seller App notification failed with status: ${response.status}`);
          } else {
            console.log(`Successfully notified Seller App for order ${paymentOrder.sellerAppOrderId}`);
          }
        } catch (fetchError) {
          console.error("Failed to reach Seller App:", fetchError);
        }
      } else {
        console.warn("SELLER_APP_URL is not configured. Could not notify Seller App.");
      }
    } else {
      console.warn(`No payment order found for external_reference: ${mpPayment.external_reference}`);
    }

  } catch (error) {
    console.error("Error processing Mercado Pago webhook:", error);
  }

  return NextResponse.json({ ok: true });
}
