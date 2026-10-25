import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusEmail } from "@/lib/email";

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
        totalAmount: 0, // Price confirmed in official invoice
        status: "Order Received",
        paymentStatus: "Pending",
        notes: notes?.trim() || null,
      },
    });

    // Automated customer & superadmin email notification
    await sendOrderStatusEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      product: order.product,
      quantity: order.quantity,
      deliveryAddress: order.deliveryAddress,
      city: order.city,
      status: "Order Received",
    });

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
