import { NextRequest, NextResponse } from "next/server";
import {
  createSessionForUser,
  isUserAuthConfigured,
} from "@/lib/user/auth";
import { verifyLoginOtp } from "@/lib/mongodb/users";
import { mergeCartForUser, type StoredCartItem } from "@/lib/mongodb/carts";

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
  const email = typeof body.email === "string" ? body.email : "";
  const otp = typeof body.otp === "string" ? body.otp : "";
  const guestCart = Array.isArray(body.cart) ? (body.cart as StoredCartItem[]) : [];

  if (!email.trim() || !otp.trim()) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

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
