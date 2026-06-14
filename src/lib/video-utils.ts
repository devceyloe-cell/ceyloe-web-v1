const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function getYouTubeVideoId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match?.[1] ?? null;
}

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeVideoId(url) !== null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function isDirectVideoUrl(url: string): boolean {
  if (isYouTubeUrl(url)) return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith("/");
}
