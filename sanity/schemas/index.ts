export default {
  name: "default",
  title: "Ceyloe CMS",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [],

  schema: {
    types: [
      {
        name: "siteSettings",
        title: "Site Settings",
        type: "document",
        fields: [
          {
            name: "hero",
            title: "Hero Section",
            type: "object",
            fields: [
              { name: "headline", type: "string" },
              { name: "subheadline", type: "text" },
              { name: "ctaLabel", type: "string" },
              { name: "ctaHref", type: "string" },
            ],
          },
          {
            name: "brandStory",
            title: "Brand Story",
            type: "object",
            fields: [
              { name: "title", type: "string" },
              { name: "paragraphs", type: "array", of: [{ type: "text" }] },
              { name: "image", type: "image" },
            ],
          },
        ],
      },
      {
        name: "testimonial",
        title: "Testimonial",
        type: "document",
        fields: [
          { name: "name", type: "string" },
          { name: "location", type: "string" },
          { name: "quote", type: "text" },
          { name: "rating", type: "number" },
          { name: "product", type: "string" },
        ],
      },
      {
        name: "certification",
        title: "Certification",
        type: "document",
        fields: [
          { name: "title", type: "string" },
          { name: "description", type: "text" },
          { name: "icon", type: "string" },
          { name: "order", type: "number" },
        ],
      },
    ],
  },
};
