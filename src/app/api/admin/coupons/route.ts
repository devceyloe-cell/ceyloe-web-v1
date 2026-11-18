import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { createCoupon, listCoupons } from "@/lib/mongodb/coupons";
import type { CouponInput } from "@/types/coupon";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const coupons = await listCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as CouponInput;
  const result = await createCoupon(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ coupon: result }, { status: 201 });
}
