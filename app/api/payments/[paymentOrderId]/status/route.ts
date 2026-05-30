import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
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
  const { userId } = await auth();
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[] | undefined) ?? [];

  if (!roles.includes("admin")) {
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
    data: {
      status: body.status as PaymentStatus,
      mpStatus: "manual_override",
      mpStatusDetail: `manual_override_to_${body.status}`,
    },
  });

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
          status: updatedOrder.status,
        }),
      });
      if (!response.ok) {
        console.error(`Seller App notification failed with status: ${response.status}`);
      } else {
        console.log(`Successfully notified Seller App for order ${paymentOrder.sellerAppOrderId} (manual override)`);
      }
    } catch (fetchError) {
      console.error("Failed to reach Seller App:", fetchError);
    }
  } else {
    console.warn("SELLER_APP_URL is not configured. Could not notify Seller App.");
  }

  return NextResponse.json({ ok: true, status: updatedOrder.status });
}
