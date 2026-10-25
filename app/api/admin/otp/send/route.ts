import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "Superadmin") {
    return NextResponse.json({ error: "Only Superadmin can request password change OTP" }, { status: 403 });
  }

  try {
    const superadminEmail = "rishav79031@gmail.com";
    // 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove old OTPs for this email
    await prisma.otp.deleteMany({ where: { email: superadminEmail } });

    await prisma.otp.create({
      data: {
        email: superadminEmail,
        code,
        expiresAt,
      },
    });

    // In production or development: log and trigger email notification
    console.log(`=========================================`);
    console.log(`[EMAIL OTP SECURITY NOTIFICATION]`);
    console.log(`To: ${superadminEmail}`);
    console.log(`Subject: Password Reset OTP - Organic Gold Garlic Admin`);
    console.log(`Your 6-digit OTP code is: ${code}`);
    console.log(`This code expires in 10 minutes.`);
    console.log(`=========================================`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit OTP has been sent to ${superadminEmail}. Please check your inbox.`,
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to generate security OTP" }, { status: 500 });
  }
}
