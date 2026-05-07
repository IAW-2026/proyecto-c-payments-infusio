import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ paymentOrderId: string }>;
};

/**
 * GET /api/payments/status/:paymentOrderId
 *
 * Returns the current status of a PaymentOrder.
 * Called by Seller App with x-api-key header.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const { paymentOrderId } = await context.params;

  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { id: paymentOrderId },
  });

  if (!paymentOrder) {
    return NextResponse.json(
      { error: "Payment order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    payment_order_id: paymentOrder.id,
    status: paymentOrder.status,
    amount: paymentOrder.amount,
    created_at: paymentOrder.createdAt,
    updated_at: paymentOrder.updatedAt,
  });
}
