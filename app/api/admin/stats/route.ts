import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period"); // "30d" | "3m" | "6m" | "all"

    let startDate: Date | undefined;
    if (period === "30d") {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === "3m") {
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    } else if (period === "6m") {
      startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    }

    const orderWhere = startDate ? { createdAt: { gte: startDate }, isDeleted: false } : { isDeleted: false };
    const enquiryWhere = startDate ? { createdAt: { gte: startDate }, isDeleted: false } : { isDeleted: false };

    const [
      totalEnquiries,
      pendingEnquiries,
      totalOrders,
      orderReceivedCount,
      orderAcceptedCount,
      invoiceGeneratedCount,
      paymentReceivedCount,
      orderProcessedCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      ordersForRevenue,
    ] = await Promise.all([
      prisma.enquiry.count({ where: enquiryWhere }),
      prisma.enquiry.count({ where: { ...enquiryWhere, status: "Pending" } }),
      prisma.order.count({ where: orderWhere }),
      prisma.order.count({ where: { ...orderWhere, status: { in: ["Order Received", "Pending"] } } }),
      prisma.order.count({ where: { ...orderWhere, status: { in: ["Order Accepted", "Confirmed"] } } }),
      prisma.order.count({ where: { ...orderWhere, status: "Invoice Generated" } }),
      prisma.order.count({ where: { ...orderWhere, status: "Payment Received" } }),
      prisma.order.count({ where: { ...orderWhere, status: { in: ["Order Processed", "Processing"] } } }),
      prisma.order.count({ where: { ...orderWhere, status: "Shipped" } }),
      prisma.order.count({ where: { ...orderWhere, status: "Delivered" } }),
      prisma.order.count({ where: { ...orderWhere, status: "Cancelled" } }),
      prisma.order.findMany({
        where: { ...orderWhere, status: { not: "Cancelled" } },
        select: { totalAmount: true, invoiceAmount: true },
      }),
    ]);

    const totalRevenue = ordersForRevenue.reduce(
      (acc, curr) => acc + (curr.invoiceAmount || curr.totalAmount || 0),
      0
    );

    return NextResponse.json({
      user: session,
      period: period || "all",
      stats: {
        totalEnquiries,
        pendingEnquiries,
        totalOrders,
        orderReceivedCount,
        orderAcceptedCount,
        invoiceGeneratedCount,
        paymentReceivedCount,
        orderProcessedCount,
        shippedCount,
        deliveredCount,
        cancelledCount,
        totalRevenue,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}