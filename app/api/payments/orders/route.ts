import { NextRequest, NextResponse } from "next/server";
import { validateControlApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/lib/generated/prisma";

const VALID_STATUSES: PaymentStatus[] = ["pending", "accepted", "cancelled"];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * GET /api/payments/orders
 *
 * Lists payment orders with pagination and optional filters.
 * Auth: x-api-key → CONTROL_API_KEY
 *
 * Query params:
 * - page (default: 1)
 * - limit (default: 20, max: 100)
 * - status (optional: pending | accepted | cancelled)
 * - buyerId (optional)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = validateControlApiKey(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10)));
  const statusParam = searchParams.get("status");
  const buyerIdParam = searchParams.get("buyerId");

  const where: Record<string, unknown> = {};

  if (statusParam && VALID_STATUSES.includes(statusParam as PaymentStatus)) {
    where.status = statusParam as PaymentStatus;
  }

  if (buyerIdParam) {
    where.buyerId = buyerIdParam;
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.paymentOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.paymentOrder.count({ where }),
  ]);

  return NextResponse.json({
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
