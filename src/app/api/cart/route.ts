import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/user/auth";
import {
  getCartByUserId,
  setCartForUser,
  type StoredCartItem,
} from "@/lib/mongodb/carts";

function normalizeItems(raw: unknown): StoredCartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is StoredCartItem =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as StoredCartItem).handle === "string" &&
        typeof (item as StoredCartItem).title === "string" &&
        typeof (item as StoredCartItem).price === "number",
    )
    .map((item) => ({
      id: String(item.id ?? item.handle),
      handle: item.handle,
      title: item.title,
      price: item.price,
      image: typeof item.image === "string" ? item.image : "",
      origin: typeof item.origin === "string" ? item.origin : undefined,
    }));
}

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getCartByUserId(session.id);
  return NextResponse.json({ items });
}

export async function PUT(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const items = normalizeItems(body.items);
  const saved = await setCartForUser(session.id, items);
  return NextResponse.json({ items: saved });
}
