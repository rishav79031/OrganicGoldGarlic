import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { otp, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    const userEmail = session.email.toLowerCase();
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // Method A: Verified via Current Password
    if (currentPassword) {
      const isValid = verifyPassword(currentPassword, currentUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    } 
    // Method B: Verified via OTP
    else if (otp) {
      const foundOtp = await prisma.otp.findFirst({
        where: {
          email: userEmail,
          code: otp.trim(),
          expiresAt: { gt: new Date() },
        },
      });

      if (!foundOtp) {
        return NextResponse.json({ error: "Invalid or expired OTP. Please request a new code." }, { status: 400 });
      }

      await prisma.otp.delete({ where: { id: foundOtp.id } });
    } else {
      return NextResponse.json({ error: "Please provide either your current password or verification OTP." }, { status: 400 });
    }

    // Update password for user
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashPassword(newPassword) },
    });

    console.log(`[PASSWORD CHANGED] User ${session.name} (${userEmail}) successfully updated password.`);

    return NextResponse.json({
      success: true,
      message: "Your password has been changed successfully!",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
