import type { Testimonial } from "@/types";

export const googleBusiness = {
  name: "Ceyloe Gemstones",
  address: "273 Hannan St, Kalgoorlie WA 6430, Australia",
  platform: "Google",
  rating: 4.9,
  reviewCount: 8,
  sourceUrl:
    "https://www.google.com/search?kgmid=/g/11zdc67hb8&q=Ceyloe+Gemstones",
} as const;

type GoogleReviewInput = {
  name: string;
  rating: number;
  dateLabel: string;
  text: string | null;
  textComplete: boolean;
  hasPhoto?: boolean;
};

const rawReviews: GoogleReviewInput[] = [
  {
    name: "Ambrotius K",
    rating: 5,
    dateLabel: "4 weeks ago",
    text: "Always go out of their way to find me the perfect gemstone. Always welcoming and friendly service. 💯 recommend.",
    textComplete: true,
  },
  {
    name: "Michael Fox",
    rating: 5,
    dateLabel: "a month ago",
    text: "I recently purchased a 19-carat Star Sapphire from Ceyloe Gem Stones, and I couldn’t be more impressed. The quality of the gem is exceptional, and the service throughout was outstanding. It’s refreshing to deal with a gem dealer who clearly",
    textComplete: false,
  },
  {
    name: "Niroshini Athukorala",
    rating: 5,
    dateLabel: "2 months ago",
    text: "A lovely gemstone business run by wonderful, trustworthy people. They’re friendly, knowledgeable, and passionate about what they do. I’m happy to recommend them to anyone looking for beautiful gemstones and excellent service.",
    textComplete: true,
  },
  {
    name: "Sarah Bannister",
    rating: 4,
    dateLabel: "2 months ago",
    text: null,
    textComplete: true,
  },
  {
    name: "Rachael Horton",
    rating: 5,
    dateLabel: "2 months ago",
    text: "Friendly helpful staff and beautiful products",
    textComplete: true,
  },
  {
    name: "Bree Lane",
    rating: 5,
    dateLabel: "2 months ago",
    text: "Amazing shop has all the gemstone needs that’s you could want!! Amazing service as well owners are extremely lovely.",
    textComplete: false,
  },
  {
    name: "Nishika Weerasooriya",
    rating: 5,
    dateLabel: "2 months ago",
    text: "I had an excellent experience Ceyloe gemstone business. The customer service was outstanding, friendly, knowledgeable, and genuinely helpful throughout the",
    textComplete: false,
  },
];

function toQuote(review: GoogleReviewInput): string | null {
  const text = review.text?.trim();
  if (!text) {
    if (review.hasPhoto) return "Shared photos from their visit.";
    return null;
  }
  return review.textComplete ? text : `${text.trimEnd()}…`;
}

/** Google reviews with displayable copy for the homepage carousel. */
export const googleReviews: Testimonial[] = rawReviews
  .map((review, index) => {
    const quote = toQuote(review);
    if (!quote) return null;
    return {
      id: `google-${index + 1}`,
      name: review.name,
      location: `Google · ${review.dateLabel}`,
      quote,
      rating: review.rating,
      date: review.dateLabel,
    } satisfies Testimonial;
  })
  .filter((item): item is Testimonial => item !== null);

export const googleReviewStats = {
  averageRating: googleBusiness.rating,
  totalReviews: googleBusiness.reviewCount,
  pageUrl: googleBusiness.sourceUrl,
};
