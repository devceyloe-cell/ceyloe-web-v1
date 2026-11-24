import { NextRequest, NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/auth";
import {
  isValidAdminEmail,
  resetAdminPasswordWithOtp,
} from "@/lib/mongodb/admin-users";
import { ADMIN_RATE_LIMITS, consumeRateLimit, getRequestIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 503 });
  }

  const ip = getRequestIp(request);
  const limited = await consumeRateLimit(
    `admin-reset:${ip}`,
    ADMIN_RATE_LIMITS.resetPassword.limit,
    ADMIN_RATE_LIMITS.resetPassword.windowMs,
  );
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: `Too many reset attempts. Try again in ${limited.retryAfterSeconds} seconds.`,
      },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!username || !isValidAdminEmail(username)) {
    return NextResponse.json(
      { error: "Enter a valid admin email." },
      { status: 400 },
    );
  }
  if (!otp || !newPassword) {
    return NextResponse.json(
      { error: "Code and new password are required." },
      { status: 400 },
    );
  }

  try {
    const result = await resetAdminPasswordWithOtp(username, otp, newPassword);
    if (!("ok" in result) || !result.ok) {
      const attemptsRemaining =
        "attemptsRemaining" in result ? result.attemptsRemaining : 0;
      const reason = "reason" in result ? result.reason : "invalid";
      const message =
        reason === "exhausted"
          ? "Too many incorrect codes. Request a new reset code."
          : reason === "expired"
            ? "Reset code expired. Request a new one."
            : attemptsRemaining > 0
              ? `Invalid code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} left.`
              : "Invalid or expired code";
      return NextResponse.json({ error: message, attemptsRemaining }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not reset password";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
