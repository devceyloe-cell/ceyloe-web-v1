import { getSanityClient, isSanityConfigured } from "./client";
import { SITE_CONTENT_QUERY } from "./queries";
import type { SiteContent } from "@/types";

export async function fetchSanitySiteContent(): Promise<SiteContent | null> {
  if (!isSanityConfigured()) return null;

  try {
    const client = getSanityClient();
    return await client.fetch<SiteContent>(SITE_CONTENT_QUERY);
  } catch {
    return null;
  }
}
