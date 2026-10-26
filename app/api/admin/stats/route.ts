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

    // High performance: 2 batch queries instead of 12 sequential network round-trips to Turso
    const [allOrders, allEnquiries] = await Promise.all([
      prisma.order.findMany({
        where: orderWhere,
        select: {
          status: true,
          totalAmount: true,
          invoiceAmount: true,
        },
      }),
      prisma.enquiry.findMany({
        where: enquiryWhere,
        select: {
          status: true,
        },
      }),
    ]);

    let totalRevenue = 0;
    let orderReceivedCount = 0;
    let orderAcceptedCount = 0;
    let invoiceGeneratedCount = 0;
    let paymentReceivedCount = 0;
    let orderProcessedCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    for (const ord of allOrders) {
      const st = ord.status;
      if (st === "Order Received" || st === "Pending") orderReceivedCount++;
      else if (st === "Order Accepted" || st === "Confirmed") orderAcceptedCount++;
      else if (st === "Invoice Generated") invoiceGeneratedCount++;
      else if (st === "Payment Received") paymentReceivedCount++;
      else if (st === "Order Processed" || st === "Processing") orderProcessedCount++;
      else if (st === "Shipped") shippedCount++;
      else if (st === "Delivered") deliveredCount++;
      else if (st === "Cancelled") cancelledCount++;

      if (st !== "Cancelled") {
        totalRevenue += ord.invoiceAmount || ord.totalAmount || 0;
      }
    }

    const totalOrders = allOrders.length;
    const totalEnquiries = allEnquiries.length;
    const pendingEnquiries = allEnquiries.filter((e) => e.status === "Pending").length;

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