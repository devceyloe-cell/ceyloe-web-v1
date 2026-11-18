import { NextRequest, NextResponse } from "next/server";
import { isMongoConfigured } from "@/config/env";
import { validateCouponCode } from "@/lib/mongodb/coupons";
import { getSellPrice, roundMoney } from "@/lib/pricing";
import { getProductByHandle } from "@/services/product-service";

export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Coupons are unavailable right now." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const handles = Array.isArray(body.handles)
    ? [
        ...new Set(
          (body.handles as unknown[])
            .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
            .map((h) => h.trim()),
        ),
      ]
    : [];

  if (!code) {
    return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
  }
  if (handles.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  let subtotal = 0;
  for (const handle of handles) {
    const product = await getProductByHandle(handle);
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${handle}` }, { status: 404 });
    }
    if (!product.inStock) {
      return NextResponse.json(
        { error: `${product.title} is currently unavailable` },
        { status: 400 },
      );
    }
    subtotal += getSellPrice(product);
  }
  subtotal = roundMoney(subtotal);

  const result = await validateCouponCode(code, subtotal);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    code: result.coupon.code,
    label: result.coupon.label || result.coupon.code,
    type: result.coupon.type,
    value: result.coupon.value,
    subtotal: result.subtotal,
    discountAmount: result.discountAmount,
    total: result.total,
  });
}
