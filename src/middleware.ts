import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "ceyloe-admin-session";

const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/api/admin/login",
  "/api/admin/verify-otp",
  "/api/admin/resend-otp",
]);

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
