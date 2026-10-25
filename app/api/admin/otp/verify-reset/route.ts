import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "Superadmin") {
    return NextResponse.json({ error: "Only Superadmin can reset password" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { otp, newPassword } = body;

    if (!otp || !newPassword) {
      return NextResponse.json({ error: "OTP and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const superadminEmail = "rishav79031@gmail.com";
    const foundOtp = await prisma.otp.findFirst({
      where: {
        email: superadminEmail,
        code: otp.trim(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!foundOtp) {
      return NextResponse.json({ error: "Invalid or expired OTP. Please request a new code." }, { status: 400 });
    }

    // Update password
    await prisma.user.update({
      where: { email: superadminEmail },
      data: { password: hashPassword(newPassword) },
    });

    // Delete used OTP
    await prisma.otp.delete({ where: { id: foundOtp.id } });

    console.log(`[PASSWORD CHANGED] Superadmin password successfully updated with verified OTP.`);

    return NextResponse.json({
      success: true,
      message: "Superadmin password changed successfully!",
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Failed to verify OTP and reset password" }, { status: 500 });
  }
}
