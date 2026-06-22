import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payments/analytics
 *
 * Returns aggregated payment metrics for the Analytics Dashboard.
 * Authenticated via x-api-key header (shared PAYMENTS_API_KEY).
 *
 * Response shape:
 * {
 *   totals: { orders, revenue, accepted, pending, cancelled, uniqueBuyers },
 *   monthly: [{ month, year, label, orders, revenue }],
 *   recentOrders: [{ id, amount, status, buyerId, createdAt }]
 * }
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.ANALYTICS_API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [
    totalOrders,
    acceptedCount,
    pendingCount,
    cancelledCount,
    revenueAgg,
    uniqueBuyersAgg,
    acceptedPayments,
    recentOrders,
  ] = await Promise.all([
    prisma.paymentOrder.count(),
    prisma.paymentOrder.count({ where: { status: "accepted" } }),
    prisma.paymentOrder.count({ where: { status: "pending" } }),
    prisma.paymentOrder.count({ where: { status: "cancelled" } }),
    prisma.paymentOrder.aggregate({
      _sum: { amount: true },
      where: { status: "accepted" },
    }),
    prisma.paymentOrder.groupBy({
      by: ["buyerId"],
      _count: true,
    }),
    prisma.paymentOrder.findMany({
      where: { status: "accepted", createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, createdAt: true },
    }),
    prisma.paymentOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        amount: true,
        status: true,
        buyerId: true,
        sellerAppOrderId: true,
        createdAt: true,
      },
    }),
  ]);

  // Build monthly breakdown (rolling 6 months)
  const monthNames = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  const monthly = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();

    const monthPayments = acceptedPayments.filter(
      (p) => p.createdAt.getMonth() === m && p.createdAt.getFullYear() === y
    );

    return {
      month: m + 1,
      year: y,
      label: monthNames[m],
      orders: monthPayments.length,
      revenue: monthPayments.reduce((acc, p) => acc + p.amount, 0),
    };
  });

  const totalRevenue = revenueAgg._sum.amount ?? 0;

  return NextResponse.json({
    totals: {
      orders: totalOrders,
      revenue: totalRevenue,
      accepted: acceptedCount,
      pending: pendingCount,
      cancelled: cancelledCount,
      uniqueBuyers: uniqueBuyersAgg.length,
      successRate: totalOrders > 0
        ? Math.round((acceptedCount / totalOrders) * 100)
        : 0,
    },
    monthly,
    recentOrders,
  });
}
