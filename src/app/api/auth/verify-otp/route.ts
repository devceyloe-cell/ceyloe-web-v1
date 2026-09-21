import { NextRequest, NextResponse } from "next/server";
import {
  createSessionForUser,
  isUserAuthConfigured,
} from "@/lib/user/auth";
import { verifyLoginOtp } from "@/lib/mongodb/users";
import { mergeCartForUser, type StoredCartItem } from "@/lib/mongodb/carts";
import { VerifyOtpSchema } from "@/lib/validation/schemas";

/**
 * Step 2 of login: verify OTP and create session.
 */
export async function POST(request: NextRequest) {
  if (!isUserAuthConfigured()) {
    return NextResponse.json(
      { error: "User login is not configured. Set MONGODB_URI and a JWT secret." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const guestCart = Array.isArray(body.cart) ? (body.cart as StoredCartItem[]) : [];

  // Validate email and OTP
  const parsed = VerifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid email or OTP format" },
      { status: 400 },
    );
  }

  const { email, otp } = parsed.data;

  const user = await verifyLoginOtp(email, otp);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired code. Request a new code and try again." },
      { status: 401 },
    );
  }

  await createSessionForUser(user);
  const cart = await mergeCartForUser(user.id, guestCart);

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email },
    cart,
  });
}
