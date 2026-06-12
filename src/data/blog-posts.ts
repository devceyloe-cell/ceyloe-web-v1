import type { BlogPost } from "@/types";
import { stitchImages } from "@/config/stitch-images";

export const blogPosts: BlogPost[] = [
  {
    slug: "understanding-ceylon-sapphires",
    title: "Understanding Ceylon Sapphires: A Collector's Guide",
    excerpt:
      "Learn what makes Sri Lankan sapphires among the most prized gemstones in the world — from colour to clarity and certification.",
    category: "Education",
    readTime: "6 min read",
    publishedAt: "2025-05-01",
    image: stitchImages.journal.chanthaburi,
    content: [
      "Ceylon sapphires — gemstones mined in Sri Lanka — have been treasured for over 2,000 years. Their exceptional clarity, vibrant colours, and ethical sourcing make them a favourite among collectors and jewellers worldwide.",
      "When evaluating a Ceylon sapphire, consider the four Cs: colour, clarity, cut, and carat weight. The most sought-after blues display a velvety 'cornflower' hue, while padparadscha sapphires offer a rare pink-orange sunset tone.",
      "Always request independent certification from laboratories such as GIA. Certification confirms the stone's origin, treatment history, and quality grade — essential for investment-grade purchases.",
      "At Ceyloe, every premium gemstone is presented in natural light, as close as possible to how it appears in person. We believe transparency is the foundation of trust.",
    ],
  },
  {
    slug: "choosing-sapphire-engagement-ring",
    title: "How to Choose a Sapphire for Your Engagement Ring",
    excerpt:
      "Sapphires are the second hardest gemstone after diamond. Here's how to select the perfect centre stone for a bespoke ring.",
    category: "Jewellery",
    readTime: "5 min read",
    publishedAt: "2025-04-18",
    image: stitchImages.journal.sapphireRings,
    content: [
      "Sapphire engagement rings have gained popularity among couples seeking something unique and meaningful. With a Mohs hardness of 9, sapphire is exceptionally durable for daily wear.",
      "Start by selecting your sapphire before designing the ring setting. The stone's shape, size, and colour should guide the overall design — not the other way around.",
      "Consider your lifestyle: oval and cushion cuts are forgiving and versatile, while emerald cuts offer a sophisticated, art-deco aesthetic.",
      "Work with a trusted supplier who can provide certification, treatment disclosure, and guidance on setting styles that protect your investment.",
    ],
  },
  {
    slug: "gemstone-treatments-explained",
    title: "Gemstone Treatments Explained: What Buyers Should Know",
    excerpt:
      "Heat treatment, diffusion, and fracture filling — understand common treatments and why disclosure matters.",
    category: "Education",
    readTime: "7 min read",
    publishedAt: "2025-04-02",
    image: stitchImages.journal.emeralds,
    content: [
      "Most gemstones undergo some form of treatment to enhance their appearance. Heat treatment of sapphires, for example, is an industry-standard practice that improves colour and clarity.",
      "Untreated stones command premium prices because of their rarity. A GIA report will clearly state whether a stone has been treated and what type of treatment was applied.",
      "At Ceyloe, we disclose all treatments transparently. Untreated stones are clearly marked and priced accordingly, so you can make an informed decision.",
      "When comparing prices, always factor in treatment status. An untreated 1-carat blue sapphire may cost significantly more than a heated stone of similar appearance — but its value retention is typically stronger.",
    ],
  },
  {
    slug: "sri-lankan-gem-mining-heritage",
    title: "The Heritage of Sri Lankan Gem Mining",
    excerpt:
      "From ancient kings to modern ethical mining — the story behind the island of gems.",
    category: "Heritage",
    readTime: "8 min read",
    publishedAt: "2025-03-15",
    image: stitchImages.sapphire,
    content: [
      "Sri Lanka, known historically as Ratna Deepa (Island of Gems), has produced some of the world's finest sapphires for over two millennia. The gem gravels of Ratnapura and Elahera have yielded stones fit for royalty.",
      "Traditional pit mining remains common in Sri Lanka, with miners working in small teams to extract gem-bearing gravel from alluvial deposits. This method has minimal environmental impact compared to open-pit industrial mining.",
      "Ceyloe maintains direct relationships with Sri Lankan miners, ensuring fair wages and responsible extraction. Our production office in Minuwangoda oversees cutting and quality control before stones reach our clients.",
      "Every gemstone we offer carries this heritage — a connection between the earth, the artisan, and the wearer that spans generations.",
    ],
  },
  {
    slug: "padparadscha-sapphire-guide",
    title: "The Padparadscha Sapphire: Nature's Rarest Hue",
    excerpt:
      "Discover the coveted pink-orange sapphire that collectors call the sunset stone.",
    category: "Education",
    readTime: "5 min read",
    publishedAt: "2025-02-28",
    image: stitchImages.ruby,
    content: [
      "Named after the lotus blossom, padparadscha sapphires display a delicate blend of pink and orange that is found almost exclusively in Sri Lanka.",
      "True padparadscha colour is subtle and balanced — neither too pink nor too orange. Stones with strong saturation and even colour distribution are exceptionally rare and highly valued.",
      "Due to their rarity, padparadscha sapphires are among the most expensive coloured gemstones per carat. Certification is essential to confirm authenticity and natural colour origin.",
      "Whether set in a ring, pendant, or kept as a loose investment stone, a fine padparadscha is a treasure that appreciates in both beauty and value over time.",
    ],
  },
  {
    slug: "investing-in-loose-gemstones",
    title: "Investing in Loose Gemstones: What to Consider",
    excerpt:
      "Fine natural gemstones can be both beautiful and a store of value. Here's what experienced collectors look for.",
    category: "Education",
    readTime: "6 min read",
    publishedAt: "2025-02-10",
    image: stitchImages.emerald,
    content: [
      "Unlike mass-produced goods, fine natural gemstones are finite resources. As deposits are depleted, quality stones from established sources like Sri Lanka tend to hold or increase in value.",
      "Focus on certified, untreated or minimally treated stones above 1 carat with strong colour and clarity. Documentation from GIA or equivalent laboratories is essential for resale.",
      "Provenance matters: stones with documented Sri Lankan origin and ethical sourcing command premiums in the international market.",
      "Store gemstones properly — individual padded boxes, away from heat and chemicals — and maintain all certification documents for future valuation or sale.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
