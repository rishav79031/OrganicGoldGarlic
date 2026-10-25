import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "goldgarlic-jwt-secret-2024";
const SUPERADMIN_EMAIL = "rishav79031@gmail.com";
const DEFAULT_PASS = process.env.ADMIN_PASSWORD ?? "GoldGarlic@2024";

export function getSecretKey() {
  return new TextEncoder().encode(ADMIN_SECRET);
}

export function hashPassword(plain: string): string {
  return crypto.createHash("sha256").update(plain.trim()).digest("hex");
}

export function verifyPassword(plain: string, hashed: string): boolean {
  return hashPassword(plain) === hashed;
}

export interface AuthSession {
  id: number;
  email: string;
  name: string;
  role: "Superadmin" | "Admin" | "Staff";
}

// Ensures superadmin user exists in database
export async function ensureSuperadminUser() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: SUPERADMIN_EMAIL },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          name: "Rishav Kumar",
          email: SUPERADMIN_EMAIL,
          password: hashPassword(DEFAULT_PASS),
          role: "Superadmin",
          status: "Active",
        },
      });
    }

    // Default Settings
    const defaultSettings = [
      { key: "forward_enquiries_email", value: SUPERADMIN_EMAIL },
      { key: "forward_orders_email", value: SUPERADMIN_EMAIL },
      { key: "notify_status_change", value: "true" },
    ];

    for (const s of defaultSettings) {
      const found = await prisma.setting.findUnique({ where: { key: s.key } });
      if (!found) {
        await prisma.setting.create({ data: s });
      }
    }
  } catch (err) {
    console.error("Error ensuring superadmin:", err);
  }
}

export async function createSessionToken(user: AuthSession): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("adminSession")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      id: Number(payload.id ?? 1),
      email: String(payload.email ?? SUPERADMIN_EMAIL),
      name: String(payload.name ?? "Superadmin"),
      role: (payload.role as "Superadmin" | "Admin" | "Staff") ?? "Superadmin",
    };
  } catch {
    return null;
  }
}
