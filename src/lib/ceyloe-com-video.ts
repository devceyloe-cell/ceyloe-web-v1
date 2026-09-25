import { unstable_cache } from "next/cache";

const PRODUCT_PAGE = "https://ceyloe.com/product";

function extractVideoUrlFromHtml(html: string): string | null {
  const sourceMatch = html.match(
    /<(?:video|source)[^>]+src=["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i,
  );
  if (sourceMatch?.[1]) return sourceMatch[1];

  const wpMatch = html.match(
    /["'](https:\/\/(?:www\.)?ceyloe\.com\/wp-content\/uploads\/[^"']+\.mp4)["']/i,
  );
  return wpMatch?.[1] ?? null;
}

async function fetchCeyloeComVideoUrl(handle: string): Promise<string | null> {
  const slug = handle.trim().toLowerCase();
  if (!slug) return null;

  try {
    const res = await fetch(`${PRODUCT_PAGE}/${slug}/`, {
      headers: { "User-Agent": "CeyloeWeb/1.0 (+video-fallback)" },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractVideoUrlFromHtml(html);
  } catch {
    return null;
  }
}

export async function getCeyloeComVideoUrl(handle: string): Promise<string | null> {
  const slug = handle.trim().toLowerCase();
  if (!slug) return null;

  return unstable_cache(
    () => fetchCeyloeComVideoUrl(slug),
    ["ceyloe-com-product-video", slug],
    { revalidate: 60 * 60 * 24 },
  )();
}

export function productVideoProxyPath(handle: string): string {
  return `/api/media/product-video?handle=${encodeURIComponent(handle.trim().toLowerCase())}`;
}
