export const SITE_CONTENT_QUERY = `
  *[_type == "siteSettings"][0] {
    hero {
      headline,
      subheadline,
      ctaLabel,
      ctaHref
    },
    brandStory {
      title,
      paragraphs,
      "image": image.asset->url
    },
    "testimonials": *[_type == "testimonial"] | order(_createdAt desc) [0...6] {
      "id": _id,
      name,
      location,
      quote,
      rating,
      product
    },
    "certifications": *[_type == "certification"] | order(order asc) {
      "id": _id,
      title,
      description,
      icon
    }
  }
`;
