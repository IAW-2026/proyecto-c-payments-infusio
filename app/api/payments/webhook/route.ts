import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

function mapMercadoPagoStatus(mpStatus: string): PaymentStatus | null {
  const statusMap: Record<string, PaymentStatus> = {
    approved: "accepted",
    rejected: "cancelled",
    cancelled: "cancelled",
    refunded: "cancelled",
    pending: "pending",
    in_process: "pending",
  };
  return statusMap[mpStatus] ?? null;
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

  // Mercado Pago can send the ID in the body or in the search params depending on the notification type
  const url = new URL(request.url);
  const paymentId = extractPaymentId(body, url);

  if (!paymentId) {
    // Acknowledge other types of webhooks (e.g., test webhooks or non-payment events)
    return NextResponse.json({ ok: true });
  }

  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
    });
    const paymentClient = new Payment(client);
    
    // Securely fetch the real payment details from Mercado Pago
    // This prevents malicious users from spoofing successful webhook requests
    const mpPayment = await paymentClient.get({ id: paymentId });

    if (!mpPayment || !mpPayment.status || !mpPayment.external_reference) {
      console.warn("Webhook ignored: Missing status or external_reference");
      return NextResponse.json({ ok: true });
    }

    const mappedStatus = mapMercadoPagoStatus(mpPayment.status);
    if (!mappedStatus) {
      console.warn(`Unknown Mercado Pago status: ${mpPayment.status}`);
      return NextResponse.json({ ok: true });
    }

    // Find our payment order using the external_reference we passed when creating the preference
    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { id: parseInt(mpPayment.external_reference, 10) },
    });

    if (paymentOrder) {
      await prisma.paymentOrder.update({
        where: { id: paymentOrder.id },
        data: { 
          status: mappedStatus,
          mercadoPagoId: mpPayment.id?.toString(),
        },
      });
      console.log(`Payment ${paymentOrder.id} updated to ${mappedStatus} (MP ID: ${mpPayment.id})`);

      // Notify Seller App
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
