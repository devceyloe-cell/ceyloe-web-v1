import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { deleteUser, getUserById } from "@/lib/mongodb/users";
import { deleteCartForUser } from "@/lib/mongodb/carts";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 503 });
  }

  const { id } = await context.params;

  // Prevent admin from deleting themselves (avoid lockout)
  const { getAdminSession } = await import("@/lib/admin/auth");
  const session = await getAdminSession();
  if (session && session.id === id) {
    return NextResponse.json(
      { error: "Cannot delete your own admin account" },
      { status: 400 },
    );
  }

  const existing = await getUserById(id);
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const deleted = await deleteUser(id);
  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await deleteCartForUser(id);
  return NextResponse.json({ success: true });
}
