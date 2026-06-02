import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/mock/products";
import { recommendProducts } from "@/services/product-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = recommendProducts(mockProducts, body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
