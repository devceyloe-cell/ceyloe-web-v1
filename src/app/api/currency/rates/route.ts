import { NextResponse } from "next/server";
import { getExchangeRatesFromUsd } from "@/lib/currency/rates";

export async function GET() {
  const rates = await getExchangeRatesFromUsd();
  return NextResponse.json({ rates });
}
