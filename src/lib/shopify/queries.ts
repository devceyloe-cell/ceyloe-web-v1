const METAFIELD_IDENTIFIERS = `
  { namespace: "custom", key: "carat" },
  { namespace: "custom", key: "color" },
  { namespace: "custom", key: "clarity" },
  { namespace: "custom", key: "cut" },
  { namespace: "custom", key: "origin" },
  { namespace: "custom", key: "treatment" },
  { namespace: "custom", key: "certification" },
  { namespace: "custom", key: "video_url" }
`;

const PRODUCT_MEDIA_FIELDS = `
  media(first: 8) {
    edges {
      node {
        mediaContentType
        ... on Video {
          sources {
            url
            mimeType
          }
        }
        ... on ExternalVideo {
          embedUrl
          host
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          tags
          availableForSale
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          ${PRODUCT_MEDIA_FIELDS}
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          metafields(identifiers: [
            ${METAFIELD_IDENTIFIERS}
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      productType
      tags
      availableForSale
      featuredImage {
        url
        altText
      }
      images(first: 8) {
        edges {
          node {
            url
            altText
          }
        }
      }
      ${PRODUCT_MEDIA_FIELDS}
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      metafields(identifiers: [
        ${METAFIELD_IDENTIFIERS}
      ]) {
        key
        value
      }
    }
  }
`;
