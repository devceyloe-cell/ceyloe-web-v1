import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { mockProducts } from "@/data/mock/products";
import { seedProductsToDb } from "@/lib/mongodb/products";

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI in environment variables." },
      { status: 503 },
    );
  }

  const inserted = await seedProductsToDb(mockProducts);
  return NextResponse.json({ inserted });
}
