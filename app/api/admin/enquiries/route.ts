import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ enquiries }, { status: 200 });
  } catch (error) {
    console.error("Get enquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
