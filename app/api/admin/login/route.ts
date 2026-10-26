import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  ensureSuperadminUser,
  hashPassword,
} from "@/lib/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Rish@1234";
const SUPERADMIN_EMAIL = "rishav79031@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const { email, password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const cleanEmail = (email || SUPERADMIN_EMAIL).trim().toLowerCase();

    // 1. Direct Master Superadmin Check (Fail-safe for rishav79031@gmail.com)
    if (cleanEmail === SUPERADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const sessionToken = await createSessionToken({
        id: 1,
        email: SUPERADMIN_EMAIL,
        name: "Rishav Kumar",
        role: "Superadmin",
      });

      const response = NextResponse.json({
        success: true,
        message: "Logged in as Superadmin",
        user: { name: "Rishav Kumar", role: "Superadmin", email: SUPERADMIN_EMAIL },
      });

      response.cookies.set("adminSession", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      // Background ensure DB has user
      ensureSuperadminUser().catch(() => {});

      return response;
    }

    // 2. Database User Verification
    let user = null;
    try {
      await ensureSuperadminUser();
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn("Database lookup failed during login:", dbErr);
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify hashed password or direct env match for superadmin
    const hashed = hashPassword(password);
    const isValid =
      user.password === hashed ||
      (user.role === "Superadmin" && password === ADMIN_PASSWORD);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status !== "Active") {
      return NextResponse.json(
        { error: "Account is disabled. Contact superadmin." },
        { status: 403 }
      );
    }

    const sessionToken = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "Superadmin" | "Admin" | "Staff",
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: { name: user.name, role: user.role, email: user.email },
    });

    response.cookies.set("adminSession", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}