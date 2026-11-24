import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/auth";
import { createAdminUser, listAdminUsers } from "@/lib/mongodb/admin-users";
import { AdminCreateSchema } from "@/lib/validation/schemas";

export async function GET() {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admins = await listAdminUsers();
  return NextResponse.json({
    admins: admins.map((admin) => ({
      id: admin.id,
      email: admin.username,
      role: admin.role,
      mfaEnabled: admin.mfaEnabled,
      active: admin.active,
      createdAt: admin.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = AdminCreateSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid admin payload" },
      { status: 400 },
    );
  }

  try {
    const admin = await createAdminUser(parsed.data.email, parsed.data.password, {
      role: parsed.data.role,
      mfaEnabled: parsed.data.mfaEnabled,
    });
    return NextResponse.json(
      {
        admin: {
          id: admin.id,
          email: admin.username,
          role: admin.role,
          mfaEnabled: admin.mfaEnabled,
          active: admin.active,
          createdAt: admin.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create admin";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
