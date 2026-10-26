import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "fallback-secret";

function getSecretKey() {
  return new TextEncoder().encode(ADMIN_SECRET);
}

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("adminSession")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

const validStatuses = ["Pending", "Answered", "Contacted", "Confirmed", "Completed"] as const;
const statusSchema = z.object({
  status: z.enum(validStatuses),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json() as unknown;
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ success: true, enquiry: updated }, { status: 200 });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deleted = await prisma.enquiry.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Enquiry from ${deleted.name} deleted successfully (soft delete).`,
      enquiry: deleted,
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
