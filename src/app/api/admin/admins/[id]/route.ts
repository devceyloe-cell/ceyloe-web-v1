import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/auth";
import {
  setAdminPasswordByOwner,
  updateAdminByOwner,
} from "@/lib/mongodb/admin-users";
import { AdminUpdateSchema } from "@/lib/validation/schemas";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await requireOwner();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const parsed = AdminUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid update" },
      { status: 400 },
    );
  }

  const { role, active, mfaEnabled, password } = parsed.data;
  if (
    role === undefined &&
    active === undefined &&
    mfaEnabled === undefined &&
    !password
  ) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  try {
    if (password) {
      await setAdminPasswordByOwner(id, password);
    }

    const admin = await updateAdminByOwner(
      id,
      { role, active, mfaEnabled },
      session.id,
    );

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.username,
        role: admin.role,
        mfaEnabled: admin.mfaEnabled,
        active: admin.active,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update admin";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
