import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const where = status && status !== "All" ? { status } : {};
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      state,
      pincode,
      product,
      quantity = 1,
      totalAmount = 0,
      status = "Pending",
      paymentStatus = "Pending",
      notes,
    } = body;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const orderNumber = `OGG-${dateStr}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : null,
        deliveryAddress: deliveryAddress.trim(),
        city: (city || "Araria").trim(),
        state: state?.trim() || "Bihar",
        pincode: pincode?.trim() || null,
        product,
        quantity: Number(quantity) || 1,
        totalAmount: Number(totalAmount) || 0,
        status,
        paymentStatus,
        notes: notes?.trim() || `Added by ${session.name} (${session.role})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Manual Order #${orderNumber} created.`,
      order,
    });
  } catch (err) {
    console.error("Create manual order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
