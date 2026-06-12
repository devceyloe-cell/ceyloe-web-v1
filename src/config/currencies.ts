export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  country: string;
}

/** Base catalog prices are stored in USD; rates convert from USD. */
export const BASE_CURRENCY = "USD";

export const currencyOptions: CurrencyOption[] = [
  { code: "AUD", symbol: "A$", label: "AUD $", country: "Australia" },
  { code: "USD", symbol: "$", label: "USD $", country: "United States" },
  { code: "GBP", symbol: "£", label: "GBP £", country: "United Kingdom" },
  { code: "EUR", symbol: "€", label: "EUR €", country: "European Union" },
  { code: "CAD", symbol: "C$", label: "CAD $", country: "Canada" },
  { code: "NZD", symbol: "NZ$", label: "NZD $", country: "New Zealand" },
  { code: "SGD", symbol: "S$", label: "SGD $", country: "Singapore" },
  { code: "HKD", symbol: "HK$", label: "HKD $", country: "Hong Kong SAR" },
  { code: "JPY", symbol: "¥", label: "JPY ¥", country: "Japan" },
  { code: "AED", symbol: "د.إ", label: "AED د.إ", country: "United Arab Emirates" },
  { code: "CHF", symbol: "CHF", label: "CHF", country: "Switzerland" },
  { code: "LKR", symbol: "Rs", label: "LKR Rs", country: "Sri Lanka" },
  { code: "INR", symbol: "₹", label: "INR ₹", country: "India" },
  { code: "CNY", symbol: "¥", label: "CNY ¥", country: "China" },
  { code: "KRW", symbol: "₩", label: "KRW ₩", country: "South Korea" },
];

export const defaultCurrency = currencyOptions.find((c) => c.code === "AUD") ?? currencyOptions[0];

export function getCurrencyOption(code: string): CurrencyOption {
  return currencyOptions.find((c) => c.code === code) ?? defaultCurrency;
}

/** Fallback USD cross-rates when live API is unavailable. */
export const fallbackRatesFromUsd: Record<string, number> = {
  USD: 1,
  AUD: 1.55,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  NZD: 1.67,
  SGD: 1.34,
  HKD: 7.82,
  JPY: 149,
  AED: 3.67,
  CHF: 0.88,
  LKR: 300,
  INR: 83,
  CNY: 7.24,
  KRW: 1320,
};
