import { NextRequest, NextResponse } from "next/server";
import {
  clearMfaPendingCookie,
  createSessionToken,
  getAdminMfaPending,
  isAdminConfigured,
  setSessionCookie,
} from "@/lib/admin/auth";
import { verifyAdminLoginOtpDetailed } from "@/lib/mongodb/admin-users";
import { ADMIN_RATE_LIMITS, consumeRateLimit, getRequestIp } from "@/lib/rate-limit";
import { AdminVerifyOtpSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 503 });
  }

  const ip = getRequestIp(request);
  const limited = await consumeRateLimit(
    `admin-otp:${ip}`,
    ADMIN_RATE_LIMITS.verifyOtp.limit,
    ADMIN_RATE_LIMITS.verifyOtp.windowMs,
  );
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: `Too many verification attempts. Try again in ${limited.retryAfterSeconds} seconds.`,
      },
      { status: 429 },
    );
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

  let result;
  try {
    result = await verifyAdminLoginOtpDetailed(pending.username, parsed.data.otp);
  } catch (err) {
    console.error("[admin/verify-otp] verifyAdminLoginOtpDetailed threw:", err);
    return NextResponse.json(
      { error: "Database unavailable. Check MongoDB connection." },
      { status: 503 },
    );
  }

  if (!result.ok || result.user.id !== pending.id) {
    const attemptsRemaining = result.ok ? 0 : result.attemptsRemaining;
    const message =
      !result.ok && result.reason === "exhausted"
        ? "Too many incorrect codes. Sign in again or resend a new code."
        : !result.ok && result.reason === "expired"
          ? "Code expired. Request a new one."
          : attemptsRemaining > 0
            ? `Invalid code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} left.`
            : "Invalid or expired code";

    return NextResponse.json(
      { error: message, attemptsRemaining },
      { status: 401 },
    );
  }

  const token = await createSessionToken(result.user.id, result.user.username);
  if (!token) {
    return NextResponse.json({ error: "Could not create session" }, { status: 500 });
  }

  await clearMfaPendingCookie();
  await setSessionCookie(token);
  return NextResponse.json({ success: true });
}
