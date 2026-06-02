import { NextResponse } from "next/server";
import { SHOPIFY_AUTH_COOKIE } from "@/lib/shopify/customer-auth";

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = NextResponse.redirect(`${siteUrl}/account`);
  response.cookies.delete(SHOPIFY_AUTH_COOKIE);
  return response;
}

export async function GET() {
  return POST();
}
