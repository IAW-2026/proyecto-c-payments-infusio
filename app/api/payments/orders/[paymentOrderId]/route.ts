import { NextRequest, NextResponse } from "next/server";
import { validateControlApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";

type RouteContext = {
  params: Promise<{ paymentOrderId: string }>;
};

const VALID_STATUSES: PaymentStatus[] = ["pending", "accepted", "cancelled"];

/**
 * GET /api/payments/orders/:paymentOrderId
 *
 * Returns the full details of a single payment order.
 * Auth: x-api-key → CONTROL_API_KEY
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const authError = validateControlApiKey(request);
  if (authError) return authError;

  const { paymentOrderId } = await context.params;
  const id = parseInt(paymentOrderId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid payment order ID" }, { status: 400 });
  }

  const order = await prisma.paymentOrder.findUnique({ where: { id } });

  if (!order) {
    return NextResponse.json({ error: "Payment order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

/**
 * PUT /api/payments/orders/:paymentOrderId
 *
 * Updates editable fields of a payment order.
 * Auth: x-api-key → CONTROL_API_KEY
 *
 * Body (all fields optional):
 * - sellerAppOrderId: string
 * - buyerId: string
 * - amount: number
 * - status: "pending" | "accepted" | "cancelled"
 * - mercadoPagoId: string | null
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const authError = validateControlApiKey(request);
  if (authError) return authError;

  const { paymentOrderId } = await context.params;
  const id = parseInt(paymentOrderId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid payment order ID" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.paymentOrder.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Payment order not found" }, { status: 404 });
  }

  // Build the update data from allowed fields only
  const data: Record<string, unknown> = {};

  if (typeof body.sellerAppOrderId === "string" && body.sellerAppOrderId.trim()) {
    // Check uniqueness if changing sellerAppOrderId
    if (body.sellerAppOrderId !== existing.sellerAppOrderId) {
      const conflict = await prisma.paymentOrder.findUnique({
        where: { sellerAppOrderId: body.sellerAppOrderId },
      });
      if (conflict) {
        return NextResponse.json(
          { error: "sellerAppOrderId already in use by another order" },
          { status: 409 }
        );
      }
    }
    data.sellerAppOrderId = body.sellerAppOrderId;
  }

  if (typeof body.buyerId === "string" && body.buyerId.trim()) {
    data.buyerId = body.buyerId;
  }

  if (typeof body.amount === "number" && body.amount > 0) {
    data.amount = body.amount;
  }

  if (typeof body.status === "string") {
    if (!VALID_STATUSES.includes(body.status as PaymentStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    data.status = body.status as PaymentStatus;
  }

  if (body.mercadoPagoId !== undefined) {
    data.mercadoPagoId = typeof body.mercadoPagoId === "string" ? body.mercadoPagoId : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.paymentOrder.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/payments/orders/:paymentOrderId
 *
 * Deletes a payment order.
 * Auth: x-api-key → CONTROL_API_KEY
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const authError = validateControlApiKey(request);
  if (authError) return authError;

  const { paymentOrderId } = await context.params;
  const id = parseInt(paymentOrderId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid payment order ID" }, { status: 400 });
  }

  const existing = await prisma.paymentOrder.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Payment order not found" }, { status: 404 });
  }

  await prisma.paymentOrder.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
