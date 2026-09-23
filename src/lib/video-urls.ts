/**
 * Get video URL based on environment
 * - Development: Uses local /videos/ path
 * - Production: Uses ceyloe.com URL
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Mapping of local video filenames to ceyloe.com URLs
const CEYLOE_VIDEO_URLS: Record<string, string> = {
  "3-10-ct-natural-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2026/06/Vedio-13.mp4",
  "0-98-ct-white-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-34.mp4",
  "0-63-ct-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-29.mp4",
  "0-58-ct-padparadscha.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-20.mp4",
  "0-81-ct-greenish-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-15.mp4",
  "0-82-ct-bi-color-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-35.mp4",
  "0-88-ct-yellow-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-16.mp4",
  "0-98-ct-pink-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-17.mp4",
  "1-02-ct-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/03/output-1-1.mp4",
  "1-03-ct-orange-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-11.mp4",
  "1-05-ct-blue-sapphire-2.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-25.mp4",
  "1-07-ct-white-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/Reduced-Size.mp4",
  "1-13-ct-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-19.mp4",
  "1-13-ct-light-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-Reduced-Size.mp4",
  "1-14-ct-white-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-24.mp4",
  "1-18-ct-white-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output-27.mp4",
  "1-21-ct-royal-blue-sapphire.mp4": "https://ceyloe.com/wp-content/uploads/2024/04/output.mp4",
};

/**
 * Convert local video path to production URL if needed
 */
export function getVideoUrl(localPath: string): string {
  if (!IS_PRODUCTION) {
    return localPath;
  }

  // Extract filename from path
  const filename = localPath.split('/').pop();
  if (!filename) return localPath;

  // Return ceyloe.com URL if available, otherwise return local path
  return CEYLOE_VIDEO_URLS[filename] || localPath;
}

/**
 * Get environment-aware video path
 */
export function getProductVideoPath(handle: string): string {
  const localPath = `/videos/gemstones/${handle}.mp4`;
  return getVideoUrl(localPath);
}
