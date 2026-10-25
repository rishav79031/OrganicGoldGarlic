import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendOrderStatusEmail } from "@/lib/email";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      status,
      paymentStatus,
      notes,
      invoiceNumber,
      invoiceAmount,
      invoiceDate,
      courierName,
      trackingNumber,
      shippingDetails,
    } = body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (notes !== undefined) data.notes = notes;
    if (invoiceNumber !== undefined) data.invoiceNumber = invoiceNumber;
    if (invoiceAmount !== undefined) {
      data.invoiceAmount = Number(invoiceAmount);
      data.totalAmount = Number(invoiceAmount);
    }
    if (invoiceDate !== undefined) data.invoiceDate = invoiceDate ? new Date(invoiceDate) : new Date();
    if (courierName !== undefined) data.courierName = courierName;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (shippingDetails !== undefined) data.shippingDetails = shippingDetails;

    const updated = await prisma.order.update({
      where: { id },
      data,
    });

    // Automated Email Dispatch on Status Change or Invoice/Shipping details update
    if (status || invoiceNumber || trackingNumber) {
      try {
        await sendOrderStatusEmail({
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          customerPhone: updated.customerPhone,
          product: updated.product,
          quantity: updated.quantity,
          deliveryAddress: updated.deliveryAddress,
          city: updated.city,
          status: updated.status,
          invoiceNumber: updated.invoiceNumber,
          invoiceAmount: updated.invoiceAmount,
          courierName: updated.courierName,
          trackingNumber: updated.trackingNumber,
          shippingDetails: updated.shippingDetails,
        });
      } catch (emailErr) {
        console.warn("Failed to dispatch order status email:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order #${updated.orderNumber} updated to ${updated.status}`,
      order: updated,
    });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.role !== "Superadmin" && session.role !== "Admin")) {
    return NextResponse.json({ error: "Only Superadmin/Admin can delete orders." }, { status: 403 });
  }

  const id = Number(params.id);
  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Order deleted successfully." });
  } catch (err) {
    console.error("Delete order error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}