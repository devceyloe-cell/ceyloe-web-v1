/** Vercel Blob store for product videos (CEYLOE store). */
export function getBlobReadWriteToken(): string | undefined {
  return (
    process.env.CEYLOE_READ_WRITE_TOKEN?.trim() ||
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    undefined
  );
}

export function isCeyloeBlobConfigured(): boolean {
  return Boolean(getBlobReadWriteToken());
}

/** Public host for the linked blob store, e.g. p3pmh1n6wu63k9yi.public.blob.vercel-storage.com */
export function getBlobPublicHost(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CEYLOE_BLOB_HOST?.trim();
  if (fromEnv) return fromEnv.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const storeId = process.env.CEYLOE_STORE_ID?.trim() || process.env.BLOB_STORE_ID?.trim();
  if (storeId?.startsWith("store_")) {
    const slug = storeId.slice("store_".length).toLowerCase();
    return `${slug}.public.blob.vercel-storage.com`;
  }

  return "p3pmh1n6wu63k9yi.public.blob.vercel-storage.com";
}

export function ceyloeBlobVideoPathname(handle: string): string {
  const safe = handle.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  return `videos/${safe}.mp4`;
}

export function ceyloeBlobVideoUrlForHandle(handle: string): string {
  return `https://${getBlobPublicHost()}/${ceyloeBlobVideoPathname(handle)}`;
}
