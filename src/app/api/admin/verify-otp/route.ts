import { NextRequest, NextResponse } from "next/server";
import {
  clearMfaPendingCookie,
  createSessionToken,
  getAdminMfaPending,
  isAdminConfigured,
  setSessionCookie,
} from "@/lib/admin/auth";
import { verifyAdminLoginOtp } from "@/lib/mongodb/admin-users";
import { AdminVerifyOtpSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 503 });
  }

  const pending = await getAdminMfaPending();
  if (!pending) {
    return NextResponse.json(
      { error: "Sign-in session expired. Enter your password again." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = AdminVerifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid OTP" },
      { status: 400 },
    );
  }

  let user;
  try {
    user = await verifyAdminLoginOtp(pending.username, parsed.data.otp);
  } catch (err) {
    console.error("[admin/verify-otp] verifyAdminLoginOtp threw:", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MongoDB connection." },
      { status: 503 },
    );
  }
  if (!user || user.id !== pending.id) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  const token = await createSessionToken(user.id, user.username);
  if (!token) {
    return NextResponse.json({ error: "Could not create session" }, { status: 500 });
  }

  await clearMfaPendingCookie();
  await setSessionCookie(token);
  return NextResponse.json({ success: true });
}
