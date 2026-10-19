export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  country: string;
}

/** Base catalog prices are stored in AUD; rates convert from AUD. */
export const BASE_CURRENCY = "AUD";

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

/** Fallback AUD cross-rates when live API is unavailable (1 AUD = X). */
export const fallbackRatesFromUsd: Record<string, number> = {
  AUD: 1,
  USD: 0.64,
  GBP: 0.51,
  EUR: 0.59,
  CAD: 0.88,
  NZD: 1.08,
  SGD: 0.86,
  HKD: 5.02,
  JPY: 96,
  AED: 2.35,
  CHF: 0.57,
  LKR: 192,
  INR: 53,
  CNY: 4.64,
  KRW: 860,
};
