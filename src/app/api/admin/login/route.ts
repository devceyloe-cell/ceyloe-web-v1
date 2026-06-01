import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminConfigured,
  setSessionCookie,
  validatePassword,
} from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_PASSWORD in environment variables." },
      { status: 503 },
    );
  }

  const { password } = await request.json();

  if (!validatePassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Could not create session" }, { status: 500 });
  }

  await setSessionCookie(token);
  return NextResponse.json({ success: true });
}
