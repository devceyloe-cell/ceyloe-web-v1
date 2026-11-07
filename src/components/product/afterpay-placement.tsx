"use client";

import { createElement, useEffect, useState } from "react";
import Script from "next/script";
import { afterpayPublic } from "@/config/afterpay-public";
import { cn } from "@/lib/utils";

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

/**
 * Afterpay’s web component can inject a very wide intrinsic size after load,
 * which stretches the product column on mobile. Mount client-only and clamp width.
 */
export function AfterpayPlacement({ amount, className }: AfterpayPlacementProps) {
  const { merchantId, currency, countryCode } = afterpayPublic;
  const locale = localeByCountry[countryCode] ?? "en_AU";
  const amountStr = amount.toFixed(2);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const api = (window as unknown as { Afterpay?: { init?: () => void } }).Afterpay;
    api?.init?.();
  }, [ready, amountStr, currency, locale]);

  if (!merchantId || amount <= 0) return null;

  return (
    <div
      className={cn(
        "afterpay-placement-host w-full max-w-full min-w-0 overflow-hidden",
        className,
      )}
    >
      <Script
        src="https://js.afterpay.com/afterpay-1.x.js"
        strategy="afterInteractive"
        data-analytics-enabled
        onLoad={() => {
          const api = (window as unknown as { Afterpay?: { init?: () => void } }).Afterpay;
          api?.init?.();
        }}
      />
      {ready
        ? createElement("afterpay-placement", {
            "data-locale": locale,
            "data-currency": currency,
            "data-amount": amountStr,
            "data-size": "sm",
            "data-mpid": merchantId,
          })
        : (
          <p className="font-manrope text-[12px] text-muted">
            or 4 interest-free payments with Afterpay
          </p>
        )}
    </div>
  );
}
