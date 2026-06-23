import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export function getRequestBaseUrl(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (host) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto =
      forwardedProto ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  return siteConfig.url.replace(/\/$/, "");
}
