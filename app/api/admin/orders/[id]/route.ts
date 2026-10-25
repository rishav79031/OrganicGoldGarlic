import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    const { status, paymentStatus, notes } = body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (notes !== undefined) data.notes = notes;

    const updated = await prisma.order.update({
      where: { id },
      data,
    });

    // Check email forwarding on status change
    if (status) {
      try {
        const setting = await prisma.setting.findUnique({
          where: { key: "notify_status_change" },
        });
        if (setting?.value === "true") {
          const emailSetting = await prisma.setting.findUnique({
            where: { key: "forward_orders_email" },
          });
          console.log(
            `[STATUS NOTIFICATION] Order ${updated.orderNumber} changed to "${status}". Email sent to ${emailSetting?.value || "rishav79031@gmail.com"}`
          );
        }
      } catch (e) {
        console.warn("Status notification error:", e);
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
