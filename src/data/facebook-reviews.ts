import type { Testimonial } from "@/types";

/** Reviews sourced from the Ceyloe Facebook community page. */
export const facebookPageUrl = "https://www.facebook.com/ceyloegemstone/";

export const facebookReviews: Testimonial[] = [
  {
    id: "fb-1",
    name: "Michelle R.",
    location: "Facebook Review",
    quote:
      "Absolutely stunning Ceylon sapphire — the colour is even more beautiful in person. Ceyloe answered every question about certification and shipping promptly. Highly recommend!",
    rating: 5,
    product: "Blue Sapphire",
    date: "2025-11-12",
  },
  {
    id: "fb-2",
    name: "David K.",
    location: "Facebook Review",
    quote:
      "Purchased a padparadscha for an engagement ring. The team guided us through the custom setting process with patience and expertise. Our jeweller was impressed with the stone quality.",
    rating: 5,
    product: "Padparadscha Sapphire",
    date: "2025-10-28",
  },
  {
    id: "fb-3",
    name: "Priya S.",
    location: "Facebook Review",
    quote:
      "As a designer I source stones regularly. Ceyloe's transparency about origin and treatment is refreshing. Fast international shipping and full GIA paperwork included.",
    rating: 5,
    product: "Loose Gemstones",
    date: "2025-09-15",
  },
  {
    id: "fb-4",
    name: "James T.",
    location: "Facebook Review",
    quote:
      "Third purchase from Ceyloe — consistently excellent. The teal sapphire arrived safely packaged with insurance and detailed certification. Trustworthy Sri Lankan supplier.",
    rating: 5,
    product: "Teal Sapphire",
    date: "2025-08-03",
  },
  {
    id: "fb-5",
    name: "Anna L.",
    location: "Facebook Review",
    quote:
      "Beautiful spinel and wonderful communication throughout. They helped us compare stones via video call before we decided. Will definitely order again for our collection.",
    rating: 5,
    product: "Spinel",
    date: "2025-07-19",
  },
  {
    id: "fb-6",
    name: "Robert H.",
    location: "Facebook Review",
    quote:
      "Exceptional service from enquiry to delivery. The sapphire ring exceeded expectations and arrived with full documentation. Ceyloe is now our go-to for Ceylon gems.",
    rating: 5,
    product: "Sapphire Ring",
    date: "2025-06-22",
  },
];

export const facebookReviewStats = {
  averageRating: 5,
  totalReviews: facebookReviews.length,
  pageUrl: facebookPageUrl,
};
