import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminDashboard from "@/components/admin/AdminDashboard";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "fallback-secret";

function getSecretKey() {
  return new TextEncoder().encode(ADMIN_SECRET);
}

async function verifySession(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("adminSession")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
