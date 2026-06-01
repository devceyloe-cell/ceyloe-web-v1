import { mockSiteContent } from "@/data/mock/content";
import { fetchSanitySiteContent } from "@/lib/sanity/content";
import type { SiteContent } from "@/types";

export async function getSiteContent(): Promise<SiteContent> {
  const sanityContent = await fetchSanitySiteContent();
  return sanityContent ?? mockSiteContent;
}
