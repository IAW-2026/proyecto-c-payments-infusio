import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";

type ChargeRequestBody = {
  seller_app_id: string;
  seller_app_order_id: string;
  buyer_app_id: string;
  buyer_id: string;
  amount: number;
};

function isValidChargeBody(body: unknown): body is ChargeRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.seller_app_id === "string" &&
    typeof b.seller_app_order_id === "string" &&
    typeof b.buyer_app_id === "string" &&
    typeof b.buyer_id === "string" &&
    typeof b.amount === "number" &&
    b.amount > 0
  );
}

/**
 * POST /api/payments/charge
 *
 * Creates a new PaymentOrder and returns a checkout URL.
 * Called by Seller App with x-api-key header.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authError = validateApiKey(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!isValidChargeBody(body)) {
    return NextResponse.json(
      {
        error: "Missing or invalid fields",
        required: {
          seller_app_id: "string",
          seller_app_order_id: "string",
          buyer_app_id: "string",
          buyer_id: "string",
          amount: "number > 0",
        },
      },
      { status: 400 }
    );
  }

  const paymentOrder = await prisma.paymentOrder.create({
    data: {
      sellerAppId: body.seller_app_id,
      sellerAppOrderId: body.seller_app_order_id,
      buyerAppId: body.buyer_app_id,
      buyerId: body.buyer_id,
      amount: body.amount,
      status: "pending",
    },
  });

  const baseUrl = request.nextUrl.origin;

  let checkoutUrl = `${baseUrl}/checkout/${paymentOrder.id}`; // fallback

  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
    });
    const preference = new Preference(client);

    const mpResponse = await preference.create({
      body: {
        items: [
          {
            id: paymentOrder.id.toString(),
            title: `Order #${body.seller_app_order_id}`,
            quantity: 1,
            unit_price: body.amount,
          },
        ],
        external_reference: paymentOrder.id.toString(),
        // @ts-expect-error mercadopago v2 SDK typings expect snake_case, but the runtime requires camelCase
        backUrls: {
          success: `${baseUrl}/payments/result`,
          failure: `${baseUrl}/payments/result`,
          pending: `${baseUrl}/payments/result`,
        },
        autoReturn: "approved",
      },
    });

    if (mpResponse.init_point) {
      checkoutUrl = mpResponse.init_point;
    }
  } catch (error) {
    console.error("Failed to create Mercado Pago preference:", error);
    // Even if MP fails, we still return the fallback local checkout URL
    // so the buyer can see the error or try again later.
  }

  return NextResponse.json(
    {
      payment_order_id: paymentOrder.id,
      checkout_url: checkoutUrl,
    },
    { status: 201 }
  );
}
