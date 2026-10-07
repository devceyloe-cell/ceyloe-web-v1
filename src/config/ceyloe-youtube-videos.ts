import { ceyloeBlobVideoUrlForHandle } from "@/lib/blob/config";

/** Videos from https://www.youtube.com/@Ceyloe.Gem.Stones */
export const ceyloeYoutubeChannel = "https://www.youtube.com/@Ceyloe.Gem.Stones";

export const ceyloeYoutubeVideos = {
  greenishBlueSapphireHeated: {
    id: "JpQOzNn4j_w",
    title: "Greenish Blue Sapphire - Heated",
    url: "https://www.youtube.com/watch?v=JpQOzNn4j_w",
  },
  ceyloeGemstones: {
    id: "LPNf_ZPPGXg",
    title: "Ceyloe Gemstones",
    url: "https://www.youtube.com/watch?v=LPNf_ZPPGXg",
  },
  gemCutting: {
    id: "tF-CsNBjXqM",
    title: "Gem Cutting - Ceyloe Gemstone",
    url: "https://www.youtube.com/watch?v=tF-CsNBjXqM",
  },
  gemMining: {
    id: "ccA7sa02dA4",
    title: "Gem Mining Process - Ceyloe Gemstone",
    url: "https://www.youtube.com/watch?v=ccA7sa02dA4",
  },
  short153: { id: "UvIcvWYbj7k", title: "Ceyloe Gemstone Short 153", url: "https://www.youtube.com/watch?v=UvIcvWYbj7k" },
  short154: { id: "CXUAbLIsZYs", title: "Ceyloe Gemstone Short 154", url: "https://www.youtube.com/watch?v=CXUAbLIsZYs" },
  short152: { id: "sMftgh77zCk", title: "Ceyloe Gemstone Short 152", url: "https://www.youtube.com/watch?v=sMftgh77zCk" },
  short151: { id: "d2kj2P1Hq7I", title: "Ceyloe Gemstone Short 151", url: "https://www.youtube.com/watch?v=d2kj2P1Hq7I" },
  short150: { id: "f9h89iPg3Bc", title: "Ceyloe Gemstone Short 150", url: "https://www.youtube.com/watch?v=f9h89iPg3Bc" },
  short149: { id: "W7OiuMRP6Mo", title: "Ceyloe Gemstone Short 149", url: "https://www.youtube.com/watch?v=W7OiuMRP6Mo" },
  short148: { id: "vp-oTCN8li8", title: "Ceyloe Gemstone Short 148", url: "https://www.youtube.com/watch?v=vp-oTCN8li8" },
  short147: { id: "ANXu1hrXX2w", title: "Ceyloe Gemstone Short 147", url: "https://www.youtube.com/watch?v=ANXu1hrXX2w" },
} as const;

// Use a generic gemstone video as default - shows gemstone handling/viewing
// This is a fallback for products without specific videos
export const defaultCeyloeProductVideoUrl = ceyloeYoutubeVideos.ceyloeGemstones.url;

/** Product handle → relevant @Ceyloe.Gem.Stones video or ceyloe.com video */
export const productVideoByHandle: Record<string, string> = {
  // Auto-generated mappings from ceyloe.com
  "1-09-ct-unheated-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-09-ct-unheated-blue-sapphire.mp4",
  "1-40-ct-brown-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-40-ct-brown-sapphire.mp4",
  "1-19-ct-unheated-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-19-ct-unheated-yellow-sapphire.mp4",
  "1-11-unheated-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-11-unheated-yellow-sapphire.mp4",
  "0-57-ct-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-57-ct-pink-sapphire.mp4",
  "1-50-ct-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-50-ct-pink-sapphire.mp4",
  "3-10-ct-natural-blue-sapphire": "https://p3pmh1n6wu63k9yi.public.blob.vercel-storage.com/videos/3-10-ct-natural-blue-sapphire.mp4",
  "1-48-ct-unheated-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-48-ct-unheated-pink-sapphire.mp4",
  "1-77-ct-natural-unheated-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-77-ct-natural-unheated-pink-sapphire.mp4",
  "0-54-ct-natural-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-54-ct-natural-blue-sapphire.mp4",
  "1-16-ct-unheated-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-16-ct-unheated-blue-sapphire.mp4",
  "1-01-ct-unheated-blue-sapphire": "https://p3pmh1n6wu63k9yi.public.blob.vercel-storage.com/videos/1-01-ct-unheated-blue-sapphire.mp4",
  "1-10-ct-natural-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-10-ct-natural-blue-sapphire.mp4",
  "1-06-ct-colour-changing-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-06-ct-colour-changing-sapphire.mp4",
  "1-00-ct-natural-colour-changing-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-00-ct-natural-colour-changing-sapphire.mp4",
  "1-02-ct-unheated-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-02-ct-unheated-yellow-sapphire.mp4",
  "best-place-to-buy-teal-sapphire-australia": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/best-place-to-buy-teal-sapphire-australia.mp4",
  "1-06-natural-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-06-natural-yellow-sapphire.mp4",
  "1-06-ct-natural-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-06-ct-natural-yellow-sapphire.mp4",
  "1-16-ct-natural-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-16-ct-natural-blue-sapphire.mp4",
  "1-12-natural-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-12-natural-yellow-sapphire.mp4",
  "2-28-ct-natural-blue-sapphire": "https://p3pmh1n6wu63k9yi.public.blob.vercel-storage.com/videos/2-28-ct-natural-blue-sapphire.mp4",
  "1-05-ct-natural-padparadscha-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-05-ct-natural-padparadscha-sapphire.mp4",
  "1-23-ct-natural-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-23-ct-natural-yellow-sapphire.mp4",
  "1-00-ct-unheated-blue-sapphire": "https://p3pmh1n6wu63k9yi.public.blob.vercel-storage.com/videos/1-00-ct-unheated-blue-sapphire.mp4",
  "1-02-carat-natural-blue-green-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-02-carat-natural-blue-green-sapphire.mp4",
  "1-02-ct-natural-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-02-ct-natural-yellow-sapphire.mp4",
  "1-03-ct-natural-green-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-03-ct-natural-green-sapphire.mp4",
  "natural-1-34ct-teal-sapphire-ceyloe": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/natural-1-34ct-teal-sapphire-ceyloe.mp4",
  "1-06-ct-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-06-ct-blue-sapphire.mp4",
  "1-05-ct-teal-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-05-ct-teal-sapphire.mp4",
  "1-05ct-blue-sapphire-cushion": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-05ct-blue-sapphire-cushion.mp4",
  "1-02-teal-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-02-teal-sapphire.mp4",
  "1-08-white-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-08-white-sapphire.mp4",
  "1-03-ct-purplish-pink": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-03-ct-purplish-pink.mp4",
  "2-02-ct-padparadscha": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/2-02-ct-padparadscha.mp4",
  "1-20-ct-blue-sapphire-2": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-20-ct-blue-sapphire-2.mp4",
  "1-12ct-fancy-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-12ct-fancy-blue-sapphire.mp4",
  "1-08-ct-unheated-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-08-ct-unheated-blue-sapphire.mp4",
  "1-20-ct-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-20-ct-blue-sapphire.mp4",
  "1-1-ct-peach-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-1-ct-peach-sapphire.mp4",
  "1-65-ct-green-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-65-ct-green-sapphire.mp4",
  "1-06-ct-teal-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-06-ct-teal-sapphire.mp4",
  "1-03-ct-teal-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-03-ct-teal-sapphire.mp4",
  "1-14-ct-yellowish-teal-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-14-ct-yellowish-teal-sapphire.mp4",
  "1-02-ct-vivid-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-02-ct-vivid-yellow-sapphire.mp4",
  "1-ct-natural-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-ct-natural-pink-sapphire.mp4",
  "1-23-ct-natural-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-23-ct-natural-blue-sapphire.mp4",
  "1-35ct-green-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-35ct-green-sapphire.mp4",
  "1-ct-emerald-shape-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-ct-emerald-shape-yellow-sapphire.mp4",
  "1-45-ct-emerald-cut-light-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-45-ct-emerald-cut-light-pink-sapphire.mp4",
  "1-02-ct-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-02-ct-blue-sapphire.mp4",
  "1-21-ct-royal-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-21-ct-royal-blue-sapphire.mp4",
  "1-07-ct-white-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-07-ct-white-sapphire.mp4",
  "1-13-ct-light-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-13-ct-light-blue-sapphire.mp4",
  "1-18-ct-white-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-18-ct-white-sapphire.mp4",
  "1-05-ct-blue-sapphire-2": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-05-ct-blue-sapphire-2.mp4",
  "1-14-ct-white-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-14-ct-white-sapphire.mp4",
  "0-81-ct-greenish-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-81-ct-greenish-blue-sapphire.mp4",
  "0-88-ct-yellow-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-88-ct-yellow-sapphire.mp4",
  "0-98-ct-pink-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-98-ct-pink-sapphire.mp4",
  "1-13-ct-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-13-ct-blue-sapphire.mp4",
  "0-58-ct-padparadscha": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-58-ct-padparadscha.mp4",
  "1-03-ct-orange-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/1-03-ct-orange-sapphire.mp4",
  "0-98-ct-white-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-98-ct-white-sapphire.mp4",
  "0-82-ct-bi-color-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-82-ct-bi-color-sapphire.mp4",
  "0-63-ct-blue-sapphire": "https://xh1ejxayjj3e2ngb.public.blob.vercel-storage.com/videos/0-63-ct-blue-sapphire.mp4",
};

export function getCeyloeProductVideoUrl(handle: string): string | undefined {
  return (
    productVideoByHandle[handle] ??
    ceyloeBlobVideoUrlForHandle(handle) ??
    defaultCeyloeProductVideoUrl
  );
}
