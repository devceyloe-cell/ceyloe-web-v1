import { unstable_cache } from "next/cache";
import { mockProducts } from "@/data/mock/products";
import { isMongoConfigured, isShopifyConfigured } from "@/config/env";
import { getCeyloeProductVideoUrl } from "@/config/ceyloe-youtube-videos";
import { productVideoProxyPath } from "@/lib/ceyloe-com-video";
import {
  fetchShopifyProductByHandle,
  fetchShopifyProducts,
} from "@/lib/shopify/products";
import {
  getAllProductsFromDb,
  getProductByHandleFromDb,
} from "@/lib/mongodb/products";
import { getProductCaratWeight, getProductShape } from "@/lib/product-utils";
import { scoreSimilarProduct } from "@/lib/product-detail";
import type { CatalogFilters, Product, RecommendRequest } from "@/types";

const PRODUCTS_REVALIDATE_SECONDS = 60;

function isBlobVideoUrl(url: string): boolean {
  return /\.public\.blob\.vercel-storage\.com\//i.test(url);
}

function withCeyloeVideo(product: Product): Product {
  const stored = product.videoUrl?.trim();
  const handle = product.handle?.trim();

  // Blob store is suspended / URLs return 403 — use same-origin proxy (Blob or ceyloe.com).
  if (handle && (!stored || isBlobVideoUrl(stored))) {
    return {
      ...product,
      videoUrl: productVideoProxyPath(handle),
    };
  }

  const videoUrl =
    stored || (handle ? getCeyloeProductVideoUrl(handle) : undefined);

  return {
    ...product,
    videoUrl,
  };
}

function applyFilters(products: Product[], filters: CatalogFilters): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  } else {
    // "All gemstones" (/catalog with no category) — never mix Fine Jewellery
    result = result.filter((p) => p.category !== "jewellery");
  }

  if (filters.color) {
    const wanted = (Array.isArray(filters.color) ? filters.color : [filters.color])
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    if (wanted.length > 0) {
      result = result.filter((p) => {
        const subcategory = p.subcategory?.trim().toLowerCase() ?? "";
        if (subcategory && wanted.includes(subcategory)) return true;
        const color = p.specs.color?.toLowerCase() ?? "";
        return wanted.some(
          (w) => color === w || color.includes(w) || w.includes(color),
        );
      });
    }
  }

  if (filters.shape) {
    result = result.filter(
      (p) => getProductShape(p)?.toLowerCase() === filters.shape!.toLowerCase(),
    );
  }

  if (filters.origin) {
    result = result.filter(
      (p) => p.specs.origin?.toLowerCase() === filters.origin!.toLowerCase(),
    );
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.minCarat !== undefined) {
    result = result.filter((p) => {
      const w = getProductCaratWeight(p);
      return w !== undefined && w >= filters.minCarat!;
    });
  }

  if (filters.maxCarat !== undefined) {
    result = result.filter((p) => {
      const w = getProductCaratWeight(p);
      return w !== undefined && w <= filters.maxCarat!;
    });
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.specs.color?.toLowerCase().includes(q) ||
        getProductShape(p)?.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
      break;
    case "updated":
      result.sort((a, b) => {
        const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
      break;
    case "manual":
      result.sort((a, b) => {
        const aOrder = a.catalogSortOrder;
        const bOrder = b.catalogSortOrder;
        const aHas = typeof aOrder === "number";
        const bHas = typeof bOrder === "number";
        if (aHas && bHas && aOrder !== bOrder) return aOrder - bOrder;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
      break;
    case "featured":
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    default:
      // Default All Gemstones: admin manual order, then most recently updated
      result.sort((a, b) => {
        const aOrder = a.catalogSortOrder;
        const bOrder = b.catalogSortOrder;
        const aHas = typeof aOrder === "number";
        const bHas = typeof bOrder === "number";
        if (aHas && bHas && aOrder !== bOrder) return aOrder - bOrder;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
      break;
  }

  return result;
}

async function fetchAllProducts(): Promise<Product[]> {
  if (isMongoConfigured()) {
    try {
      const products = await getAllProductsFromDb();
      if (products.length > 0) {
        return products.map(withCeyloeVideo);
      }
    } catch (err) {
      console.warn(
        "[product-service] MongoDB unavailable, falling back to Shopify/mock:",
        err instanceof Error ? err.message : err,
      );
    }
  }

  if (isShopifyConfigured()) {
    return (await fetchShopifyProducts()).map(withCeyloeVideo);
  }

  return mockProducts;
}

/** Cached catalog load — shared across catalog/filters/similar within revalidate window. */
export const loadAllProducts = unstable_cache(
  fetchAllProducts,
  ["all-products"],
  { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: ["products"] },
);

export async function getProducts(filters: CatalogFilters = {}): Promise<Product[]> {
  const products = await loadAllProducts();
  return applyFilters(products, filters);
}

/** Derive filtered lists, categories, and bounds from one in-memory catalog. */
export function deriveCatalogView(
  allProducts: Product[],
  filters: CatalogFilters,
  baseFilters: CatalogFilters,
) {
  const products = applyFilters(allProducts, filters);
  const selectionProducts = applyFilters(allProducts, baseFilters);
  const categories = [
    ...new Set(
      allProducts
        .map((p) => p.category)
        .filter((c) =>
          filters.category === "jewellery" ? c === "jewellery" : c !== "jewellery",
        ),
    ),
  ];
  return { products, selectionProducts, categories, allProducts };
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isMongoConfigured()) {
    try {
      const product = await getProductByHandleFromDb(handle);
      if (product) return withCeyloeVideo(product);
    } catch (err) {
      console.warn(
        "[product-service] MongoDB unavailable for handle lookup, falling back:",
        err instanceof Error ? err.message : err,
      );
    }
  }

  if (isShopifyConfigured()) {
    const product = await fetchShopifyProductByHandle(handle);
    if (product) return withCeyloeVideo(product);
  }

  return mockProducts.find((p) => p.handle === handle) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts({ sort: "featured" });
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getFeaturedProductsByCategory(
  category: string,
  limit = 4,
): Promise<Product[]> {
  const products = await getProducts({ category, sort: "featured" });
  return products.slice(0, limit);
}

export async function getSimilarProducts(product: Product, limit = 5): Promise<Product[]> {
  const products = await loadAllProducts();
  return products
    .map((candidate) => ({ candidate, score: scoreSimilarProduct(product, candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => withCeyloeVideo(entry.candidate));
}

export async function getRecentlyAddedProducts(limit = 4): Promise<Product[]> {
  return getProducts({ sort: "newest" }).then((p) => p.slice(0, limit));
}

export async function getProductCategories(): Promise<string[]> {
  const products = await loadAllProducts();
  return [...new Set(products.map((p) => p.category))];
}

export async function getAllProductsForFilters(): Promise<Product[]> {
  return loadAllProducts();
}

export function recommendProducts(
  products: Product[],
  request: RecommendRequest,
  limit = 4,
): { products: Product[]; message: string } {
  let scored = products
    .filter((p) => p.inStock && p.category !== "jewellery")
    .map((p) => {
      let score = 0;
      const carat = getProductCaratWeight(p);

      if (request.budget && p.price <= request.budget) score += 3;
      if (request.budget && p.price <= request.budget * 0.85) score += 1;

      if (request.color) {
        const wanted = request.color.toLowerCase();
        if (p.subcategory?.toLowerCase() === wanted) score += 4;
        else if (p.specs.color?.toLowerCase() === wanted) score += 4;
        else if (p.specs.color?.toLowerCase().includes(wanted)) score += 2;
      }

      if (request.shape && getProductShape(p)?.toLowerCase() === request.shape.toLowerCase()) {
        score += 3;
      }

      if (request.minCarat && carat && carat >= request.minCarat) score += 2;

      if (p.featured) score += 1;
      if (p.isNew) score += 1;

      return { product: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    scored = products
      .filter((p) => p.inStock)
      .slice(0, limit)
      .map((p) => ({ product: p, score: 0 }));
  }

  const results = scored.slice(0, limit).map((s) => s.product);

  const message =
    results.length > 0
      ? `Based on your preferences${request.occasion ? ` for ${request.occasion}` : ""}, we selected ${results.length} gemstone${results.length > 1 ? "s" : ""} that match your criteria. Our team can provide detailed guidance on each stone.`
      : "We couldn't find an exact match. Browse our full catalog or contact us for personalised assistance.";

  return { products: results, message };
}
