import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "ceyloe-admin-session";

// Secret path configured via ADMIN_SECRET_PATH env var on Vercel (never committed to git).
// e.g. ADMIN_SECRET_PATH=ceyloe-portal  →  /ceyloe-portal becomes the admin entry point.
// Direct /admin access returns 404 to hide the panel from scanners.
const SECRET_PATH = process.env.ADMIN_SECRET_PATH?.replace(/^\/+|\/+$/g, ""); // strip slashes

// These API routes must remain reachable without a session so the login flow works.
const PUBLIC_API_PATHS = new Set([
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

  // ── Secret path rewrite ────────────────────────────────────────────────────
  // /ceyloe-portal/...  →  /admin/...  (browser URL stays as secret path)
  if (SECRET_PATH && (pathname === `/${SECRET_PATH}` || pathname.startsWith(`/${SECRET_PATH}/`))) {
    const rest = pathname.slice(`/${SECRET_PATH}`.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = `/admin${rest === "/" ? "" : rest}`;
    return NextResponse.rewrite(url);
  }

  // ── Public login API routes ────────────────────────────────────────────────
  if (PUBLIC_API_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // ── Guard all /admin and /api/admin routes ─────────────────────────────────
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authed = token ? await verifyToken(token) : false;

  if (!authed) {
    // Return 404 — hides the admin panel from scanners and bots.
    // Authenticated users can still reach /admin via internal navigation after login.
    if (isAdminApi) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Broad matcher so the middleware can intercept the dynamic secret path.
  // Static assets (_next, images, fonts, favicons) are excluded for performance.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)",
  ],
};
