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

export const defaultCeyloeProductVideoUrl = ceyloeYoutubeVideos.ceyloeGemstones.url;

/** Product handle → relevant @Ceyloe.Gem.Stones video */
export const productVideoByHandle: Record<string, string> = {
  "natural-teal-sapphire-1-33ct": ceyloeYoutubeVideos.greenishBlueSapphireHeated.url,
  "natural-yellow-sapphire-1-06ct": ceyloeYoutubeVideos.ceyloeGemstones.url,
  "natural-blue-sapphire-1-16ct": ceyloeYoutubeVideos.greenishBlueSapphireHeated.url,
  "natural-padparadscha-sapphire-1-05ct": ceyloeYoutubeVideos.short154.url,
  "heated-blue-sapphire-2-28ct": ceyloeYoutubeVideos.greenishBlueSapphireHeated.url,
  "natural-tsavorite-1-16ct": ceyloeYoutubeVideos.gemMining.url,
  "red-spinel-0-95ct": ceyloeYoutubeVideos.short153.url,
  "blue-zircon-2-10ct": ceyloeYoutubeVideos.short152.url,
  "fine-jewellery-sapphire-ring": ceyloeYoutubeVideos.gemCutting.url,
  "sapphire-pendant-necklace": ceyloeYoutubeVideos.short151.url,
  "diamond-sapphire-earrings": ceyloeYoutubeVideos.short150.url,
  "custom-sapphire-bracelet": ceyloeYoutubeVideos.short149.url,
};

export function getCeyloeProductVideoUrl(handle: string): string | undefined {
  return productVideoByHandle[handle] ?? defaultCeyloeProductVideoUrl;
}
