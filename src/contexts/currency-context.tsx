"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BASE_CURRENCY,
  defaultCurrency,
  fallbackRatesFromUsd,
  getCurrencyOption,
  type CurrencyOption,
} from "@/config/currencies";
import { convertFromUsd } from "@/lib/currency/rates";

const STORAGE_KEY = "ceyloe-currency";

interface CurrencyContextValue {
  currency: CurrencyOption;
  rates: Record<string, number>;
  setCurrencyCode: (code: string) => void;
  formatProductPrice: (amountUsd: number) => string;
  convertPrice: (amountUsd: number) => number;
  isLoadingRates: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState(defaultCurrency.code);
  const [rates, setRates] = useState<Record<string, number>>(fallbackRatesFromUsd);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCurrencyCodeState(stored);
  }, []);

  useEffect(() => {
    fetch("/api/currency/rates")
      .then((r) => r.json())
      .then((data: { rates?: Record<string, number> }) => {
        if (data.rates) setRates(data.rates);
      })
      .catch(() => {})
      .finally(() => setIsLoadingRates(false));
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    setCurrencyCodeState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const currency = useMemo(() => getCurrencyOption(currencyCode), [currencyCode]);

  const convertPrice = useCallback(
    (amountUsd: number) => convertFromUsd(amountUsd, currency.code, rates),
    [currency.code, rates],
  );

  const formatProductPrice = useCallback(
    (amountUsd: number) => {
      const converted = convertPrice(amountUsd);
      const fractionDigits = ["JPY", "KRW", "LKR"].includes(currency.code) ? 0 : 0;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(converted);
    },
    [convertPrice, currency.code],
  );

  const value = useMemo(
    () => ({
      currency,
      rates,
      setCurrencyCode,
      formatProductPrice,
      convertPrice,
      isLoadingRates,
    }),
    [currency, rates, setCurrencyCode, formatProductPrice, convertPrice, isLoadingRates],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { BASE_CURRENCY };
