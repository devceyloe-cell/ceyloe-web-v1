import { BASE_CURRENCY, fallbackRatesFromUsd } from "@/config/currencies";

const CACHE_TTL_MS = 60 * 60 * 1000;
let cachedRates: Record<string, number> | null = null;
let cachedAt = 0;

/** Fetches exchange rates from AUD (the base catalog currency). */
export async function getExchangeRatesFromUsd(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedRates;
  }

  try {
    const symbols = Object.keys(fallbackRatesFromUsd)
      .filter((c) => c !== BASE_CURRENCY)
      .join(",");
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${BASE_CURRENCY}&to=${symbols}`,
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { rates: Record<string, number> };
      cachedRates = { [BASE_CURRENCY]: 1, ...data.rates };
      cachedAt = Date.now();
      return cachedRates;
    }
  } catch {
    // use fallback below
  }

  return fallbackRatesFromUsd;
}

/** Converts an amount in AUD (base currency) to the target currency. */
export function convertFromUsd(
  amountAud: number,
  targetCurrency: string,
  rates: Record<string, number>,
): number {
  const rate = rates[targetCurrency] ?? fallbackRatesFromUsd[targetCurrency] ?? 1;
  return amountAud * rate;
}
