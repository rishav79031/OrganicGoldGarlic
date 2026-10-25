import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  ensureSuperadminUser,
  hashPassword,
} from "@/lib/auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "GoldGarlic@2024";

export async function POST(request: NextRequest) {
  try {
    await ensureSuperadminUser();

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

    // 1. Direct password check (backward compatibility)
    if (!email && password === ADMIN_PASSWORD) {
      const superadmin = await prisma.user.findFirst({
        where: { role: "Superadmin" },
      });

      const sessionToken = await createSessionToken({
        id: superadmin?.id ?? 1,
        email: superadmin?.email ?? "rishav79031@gmail.com",
        name: superadmin?.name ?? "Superadmin",
        role: "Superadmin",
      });

      const response = NextResponse.json({
        success: true,
        message: "Logged in as Superadmin",
        user: { name: "Rishav Kumar", role: "Superadmin" },
      });

      response.cookies.set("adminSession", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return response;
    }

    // 2. Email + Password login check
    const cleanEmail = (email || "rishav79031@gmail.com").trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Fallback check: if email is superadmin email and matches env password
      if (cleanEmail === "rishav79031@gmail.com" && password === ADMIN_PASSWORD) {
        const sessionToken = await createSessionToken({
          id: 1,
          email: "rishav79031@gmail.com",
          name: "Rishav Kumar",
          role: "Superadmin",
        });

        const response = NextResponse.json({
          success: true,
          message: "Logged in as Superadmin",
          user: { name: "Rishav Kumar", role: "Superadmin" },
        });

        response.cookies.set("adminSession", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        return response;
      }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
