"use client";

import { createElement, useEffect } from "react";
import Script from "next/script";
import { afterpayPublic } from "@/config/afterpay-public";

const localeByCountry: Record<string, string> = {
  AU: "en_AU",
  NZ: "en_NZ",
  US: "en_US",
  CA: "en_CA",
  GB: "en_GB",
};

interface AfterpayPlacementProps {
  amount: number;
  className?: string;
}

export function AfterpayPlacement({ amount, className }: AfterpayPlacementProps) {
  const { merchantId, currency, countryCode } = afterpayPublic;
  const locale = localeByCountry[countryCode] ?? "en_AU";
  const amountStr = amount.toFixed(2);

  useEffect(() => {
    const api = (window as unknown as { Afterpay?: { init?: () => void } }).Afterpay;
    api?.init?.();
  }, [amountStr, currency, locale]);

  if (!merchantId || amount <= 0) return null;

  return (
    <div className={className}>
      <Script
        src="https://js.afterpay.com/afterpay-1.x.js"
        strategy="afterInteractive"
        data-analytics-enabled
      />
      {createElement("afterpay-placement", {
        "data-locale": locale,
        "data-currency": currency,
        "data-amount": amountStr,
        "data-size": "sm",
        "data-mpid": merchantId,
      })}
    </div>
  );
}
