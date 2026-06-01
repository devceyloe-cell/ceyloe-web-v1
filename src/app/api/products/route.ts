import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/services/product-service";
import type { CatalogFilters } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters: CatalogFilters = {
    category: searchParams.get("category") ?? undefined,
    sort: (searchParams.get("sort") as CatalogFilters["sort"]) ?? undefined,
    search: searchParams.get("search") ?? undefined,
  };

  const products = await getProducts(filters);
  return NextResponse.json({ products });
}
