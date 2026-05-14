import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";

type ChargeRequestBody = {
  seller_app_order_id: string;
  buyer_id: string;
  amount: number;
};

function isValidChargeBody(body: unknown): body is ChargeRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.seller_app_order_id === "string" &&
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
          seller_app_order_id: "string",
          buyer_id: "string",
          amount: "number > 0",
        },
      },
      { status: 400 }
    );
  }

  // Idempotency: if a PaymentOrder already exists for this order ID, return it
  const existingOrder = await prisma.paymentOrder.findUnique({
    where: { sellerAppOrderId: body.seller_app_order_id },
  });

  if (existingOrder) {
    const baseUrlExisting = request.nextUrl.origin;
    return NextResponse.json(
      {
        payment_order_id: existingOrder.id,
        checkout_url: `${baseUrlExisting}/checkout/${existingOrder.id}`,
        existing: true,
      },
      { status: 200 }
    );
  }

  const paymentOrder = await prisma.paymentOrder.create({
    data: {
      sellerAppOrderId: body.seller_app_order_id,
      buyerId: body.buyer_id,
      amount: body.amount,
      status: "pending",
    },
  });

  const baseUrl = request.nextUrl.origin;

  let checkoutUrl = `${baseUrl}/checkout/${paymentOrder.id}`;

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
        // @ts-expect-error El SDK v2 de mercadopago pide snake_case (back_urls) en TypeScript, pero en ejecución necesita camelCase (backUrls)
        backUrls: {
          success: `${baseUrl}/payments/result`,
          failure: `${baseUrl}/payments/result`,
          pending: `${baseUrl}/payments/result`,
        },
        autoReturn: "approved",
        notification_url: `${baseUrl}/api/payments/webhook`,
      },
    });

    if (mpResponse.init_point) {
      checkoutUrl = mpResponse.init_point;
    }
  } catch (error) {
    console.error("Failed to create Mercado Pago preference:", error);
  }

  return NextResponse.json(
    {
      payment_order_id: paymentOrder.id,
      checkout_url: checkoutUrl,
    },
    { status: 201 }
  );
}
