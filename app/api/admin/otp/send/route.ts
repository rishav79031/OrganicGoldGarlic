import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const userEmail = session.email.toLowerCase();
    // 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove old OTPs for this user's email
    await prisma.otp.deleteMany({ where: { email: userEmail } });

    await prisma.otp.create({
      data: {
        email: userEmail,
        code,
        expiresAt,
      },
    });

    console.log(`=========================================`);
    console.log(`[PASSWORD RESET OTP FOR USER]`);
    console.log(`User: ${session.name} (${session.role})`);
    console.log(`To: ${userEmail}`);
    console.log(`Subject: Password Reset OTP - Organic Gold Garlic`);
    console.log(`Your 6-digit OTP code is: ${code}`);
    console.log(`This code expires in 10 minutes.`);
    console.log(`=========================================`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${userEmail}.`,
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to generate security OTP" }, { status: 500 });
  }
}
