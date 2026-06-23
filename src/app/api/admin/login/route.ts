import { NextRequest, NextResponse } from "next/server";
import { isAdminConfigured, loginAdmin, setSessionCookie } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin is not configured. Set MONGODB_URI and ADMIN_JWT_SECRET, then create an admin user.",
      },
      { status: 503 },
    );
  }

  const { username, password } = await request.json();

  if (!username?.trim() || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const token = await loginAdmin(username, password);
  if (!token) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await setSessionCookie(token);
  return NextResponse.json({ success: true });
}
