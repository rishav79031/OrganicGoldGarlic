import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalEnquiries,
      pendingEnquiries,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      ordersForRevenue,
    ] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "Pending" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "Pending" } }),
      prisma.order.count({ where: { status: "Confirmed" } }),
      prisma.order.count({ where: { status: "Processing" } }),
      prisma.order.count({ where: { status: "Shipped" } }),
      prisma.order.count({ where: { status: "Delivered" } }),
      prisma.order.count({ where: { status: "Cancelled" } }),
      prisma.order.findMany({
        where: { status: { not: "Cancelled" } },
        select: { totalAmount: true },
      }),
    ]);

    const totalRevenue = ordersForRevenue.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    return NextResponse.json({
      user: session,
      stats: {
        totalEnquiries,
        pendingEnquiries,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
