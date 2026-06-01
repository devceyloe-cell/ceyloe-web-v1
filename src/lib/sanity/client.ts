import { createClient } from "@sanity/client";
import { env, isSanityConfigured } from "@/config/env";

export function getSanityClient() {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured");
  }

  return createClient({
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
    apiVersion: env.sanity.apiVersion,
    token: env.sanity.token || undefined,
    useCdn: true,
  });
}

export { isSanityConfigured };
