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
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "carat" },
            { namespace: "custom", key: "color" },
            { namespace: "custom", key: "clarity" },
            { namespace: "custom", key: "cut" },
            { namespace: "custom", key: "origin" },
            { namespace: "custom", key: "treatment" },
            { namespace: "custom", key: "certification" }
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
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "carat" },
        { namespace: "custom", key: "color" },
        { namespace: "custom", key: "clarity" },
        { namespace: "custom", key: "cut" },
        { namespace: "custom", key: "origin" },
        { namespace: "custom", key: "treatment" },
        { namespace: "custom", key: "certification" }
      ]) {
        key
        value
      }
    }
  }
`;
