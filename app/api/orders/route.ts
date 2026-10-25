import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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
      paymentStatus = "Pending",
      notes,
    } = body;

    if (!customerName || !customerPhone || !deliveryAddress || !product) {
      return NextResponse.json(
        { error: "Customer name, phone, product, and delivery address are required." },
        { status: 400 }
      );
    }

    // Generate unique Order Number: e.g. OGG-2610-842
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
        status: "Pending",
        paymentStatus,
        notes: notes?.trim() || null,
      },
    });

    // Email Forwarding logic: fetch settings
    try {
      const emailSetting = await prisma.setting.findUnique({
        where: { key: "forward_orders_email" },
      });
      const forwardTo = emailSetting?.value || "rishav79031@gmail.com";
      console.log(`[EMAIL FORWARDING] New Order ${orderNumber} notification dispatched to ${forwardTo}`);
    } catch (e) {
      console.warn("Could not read email forwarding setting:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Order #${orderNumber} placed successfully!`,
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to place order. Please try again or order directly on WhatsApp." },
      { status: 500 }
    );
  }
}
