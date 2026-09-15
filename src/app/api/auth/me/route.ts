import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user/auth";
import { getCartByUserId } from "@/lib/mongodb/carts";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ user: null, cart: [] });
  }

  const cart = await getCartByUserId(session.id);
  return NextResponse.json({
    user: { id: session.id, email: session.email },
    cart,
  });
}
