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
  if (!session || (session.role !== "Superadmin" && session.role !== "Admin")) {
    return NextResponse.json({ error: "Only Admin & Superadmin can update system settings" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, string | boolean | undefined>;

    const keysToSave = [
      "forward_enquiries_email",
      "forward_orders_email",
      "notify_status_change",
      "company_legal_name",
      "gst_number",
      "pan_number",
      "fssai_license",
      "bank_name",
      "bank_account_no",
      "bank_ifsc",
      "upi_id",
      "invoice_terms",
      "active_theme",
    ];

    for (const key of keysToSave) {
      if (body[key] !== undefined) {
        const val = String(body[key] ?? "").trim();
        await prisma.setting.upsert({
          where: { key },
          update: { value: val },
          create: { key, value: val },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully.",
    });
  } catch (err) {
    console.error("Save settings error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}