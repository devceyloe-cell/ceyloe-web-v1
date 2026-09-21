import { NextRequest, NextResponse } from "next/server";
import { isUserAuthConfigured } from "@/lib/user/auth";
import { issueLoginOtp } from "@/lib/mongodb/users";
import { sendLoginOtpEmail } from "@/lib/email/send";
import { LoginSchema } from "@/lib/validation/schemas";

/**
 * Step 1 of login: validate account and email a one-time code.
 * Does not create a session until OTP is verified.
 */
export async function POST(request: NextRequest) {
  if (!isUserAuthConfigured()) {
    return NextResponse.json(
      { error: "User login is not configured. Set MONGODB_URI and a JWT secret." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));

  // Validate input
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid email" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  try {
    const issued = await issueLoginOtp(email);
    if (!issued) {
      // Generic error to prevent account enumeration
      return NextResponse.json(
        { error: "If an account exists with this email, we sent a login code." },
        { status: 200 },
      );
    }

    const mail = await sendLoginOtpEmail(issued.user.email, issued.otp);

    return NextResponse.json({
      success: true,
      needsOtp: true,
      email: issued.user.email,
      message: "We sent a 6-digit code to your email. Enter it to sign in.",
      ...(mail.loggedOnly && process.env.NODE_ENV !== "production"
        ? { devOtp: issued.otp }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start login";
    if (message.toLowerCase().includes("confirm your email")) {
      // For unverified accounts, still return success to prevent enumeration
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists with this email, check your inbox for a verification link first.",
        },
        { status: 200 },
      );
    }
    // Generic error for other failures
    return NextResponse.json(
      { error: "Unable to process login request. Please try again." },
      { status: 400 },
    );
  }
}
