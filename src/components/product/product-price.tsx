"use client";

import { Price } from "@/components/ui/price";

export function ProductPrice({ amount }: { amount: number }) {
  return (
    <p className="mt-4 text-2xl text-foreground">
      <Price amount={amount} />
    </p>
  );
}
