import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    return NextResponse.json({ settings: map });
  } catch (err) {
    console.error("Fetch settings error:", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "Superadmin") {
    return NextResponse.json({ error: "Only Superadmin can update system settings" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { forward_enquiries_email, forward_orders_email, notify_status_change } = body;

    const updates = [
      { key: "forward_enquiries_email", value: forward_enquiries_email?.trim() || "rishav79031@gmail.com" },
      { key: "forward_orders_email", value: forward_orders_email?.trim() || "rishav79031@gmail.com" },
      { key: "notify_status_change", value: String(notify_status_change ?? "true") },
    ];

    for (const item of updates) {
      await prisma.setting.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: { key: item.key, value: item.value },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Email forwarding settings updated successfully.",
    });
  } catch (err) {
    console.error("Save settings error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
