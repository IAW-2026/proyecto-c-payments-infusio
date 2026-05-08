import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";

type RouteContext = {
  params: Promise<{ paymentOrderId: string }>;
};

/**
 * PATCH /api/payments/:paymentOrderId/status
 *
 * Updates the status of a PaymentOrder.
 * Only accessible by admin users.
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { sessionClaims } = await auth();
  
  if (sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { paymentOrderId } = await context.params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !["pending", "accepted", "cancelled"].includes(body.status)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { id: parseInt(paymentOrderId, 10) },
  });

  if (!paymentOrder) {
    return NextResponse.json(
      { error: "Payment order not found" },
      { status: 404 }
    );
  }

  const updatedOrder = await prisma.paymentOrder.update({
    where: { id: paymentOrder.id },
    data: { status: body.status as PaymentStatus },
  });

  return NextResponse.json({ ok: true, status: updatedOrder.status });
}
