import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { deleteCoupon, getCouponById, updateCoupon } from "@/lib/mongodb/coupons";
import type { CouponInput } from "@/types/coupon";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const coupon = await getCouponById(id);
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }
  return NextResponse.json({ coupon });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as CouponInput;
  const result = await updateCoupon(id, body);
  if ("error" in result) {
    const status = result.error === "Coupon not found." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ coupon: result });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const ok = await deleteCoupon(id);
  if (!ok) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
