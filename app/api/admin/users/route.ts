import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

const ALL_MODULES = ["dashboard", "orders", "add-order", "enquiries", "settings"];

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "Superadmin" && session.role !== "Admin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const rawUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Load custom permissions for each user from Setting
    const permKeys = rawUsers.map((u) => `user_perms_${u.id}`);
    const permSettings = await prisma.setting.findMany({
      where: { key: { in: permKeys } },
    });
    const permMap = new Map(permSettings.map((s) => [s.key, s.value]));

    const users = rawUsers.map((u) => {
      let perms: string[] = [];
      const saved = permMap.get(`user_perms_${u.id}`);
      if (saved) {
        try {
          perms = JSON.parse(saved);
        } catch {
          perms = [];
        }
      }
      if (!perms.length) {
        perms = u.role === "Superadmin" || u.role === "Admin" ? [...ALL_MODULES] : ["orders", "enquiries"];
      }
      return {
        ...u,
        permissions: perms,
      };
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Fetch users error:", err);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "Superadmin" && session.role !== "Admin")) {
    return NextResponse.json({ error: "Only Admin & Superadmin can add users" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role = "Staff", permissions } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashPassword(password),
        role,
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Save assigned module permissions
    const assignedPerms = Array.isArray(permissions) && permissions.length > 0
      ? permissions
      : role === "Superadmin" || role === "Admin"
      ? ALL_MODULES
      : ["orders", "enquiries"];

    await prisma.setting.upsert({
      where: { key: `user_perms_${user.id}` },
      update: { value: JSON.stringify(assignedPerms) },
      create: { key: `user_perms_${user.id}`, value: JSON.stringify(assignedPerms) },
    });

    return NextResponse.json({
      success: true,
      message: `User ${user.name} (${user.role}) created successfully.`,
      user: {
        ...user,
        permissions: assignedPerms,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "Superadmin") {
    return NextResponse.json({ error: "Only Superadmin can modify user permissions and status in realtime" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, permissions, role } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const dataToUpdate: { status?: string; role?: string } = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (role !== undefined) dataToUpdate.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    let updatedPerms = permissions;
    if (Array.isArray(permissions)) {
      await prisma.setting.upsert({
        where: { key: `user_perms_${id}` },
        update: { value: JSON.stringify(permissions) },
        create: { key: `user_perms_${id}`, value: JSON.stringify(permissions) },
      });
    }

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.name} updated successfully.`,
      user: {
        ...updatedUser,
        permissions: updatedPerms,
      },
    });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
