import { NextRequest, NextResponse } from "next/server";
import { createSessionForUser, isUserAuthConfigured } from "@/lib/user/auth";
import { verifyUserByToken } from "@/lib/mongodb/users";
import { getRequestBaseUrl } from "@/lib/request-base-url";

export async function GET(request: NextRequest) {
  const baseUrl = getRequestBaseUrl(request);

  if (!isUserAuthConfigured()) {
    return NextResponse.redirect(`${baseUrl}/login?error=config`);
  }

  const token = request.nextUrl.searchParams.get("token") ?? "";
  const user = await verifyUserByToken(token);

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_token`);
  }

  await createSessionForUser(user);
  return NextResponse.redirect(`${baseUrl}/cart?confirmed=1`);
}
