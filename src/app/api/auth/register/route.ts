import { NextRequest, NextResponse } from "next/server";
import { isUserAuthConfigured, startRegistration } from "@/lib/user/auth";
import { sendVerificationEmail } from "@/lib/email/send";

export async function POST(request: NextRequest) {
  if (!isUserAuthConfigured()) {
    return NextResponse.json(
      { error: "User accounts are not configured. Set MONGODB_URI and a JWT secret." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";

  if (!email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const { user, verificationToken } = await startRegistration(email);
    const mail = await sendVerificationEmail(request, user.email, verificationToken);

    return NextResponse.json({
      success: true,
      needsVerification: true,
      email: user.email,
      message: "Check your email and click the confirmation link to activate your account.",
      ...(mail.loggedOnly && process.env.NODE_ENV !== "production"
        ? { devVerifyUrl: mail.verifyUrl }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create account";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
