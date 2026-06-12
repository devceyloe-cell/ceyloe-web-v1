import Image from "next/image";

/** Payment badges sourced from The Sapphire Merchant footer (Shopify payment icons). */
const paymentMethods = [
  { id: "amex", src: "/images/payments/amex.svg", label: "American Express", width: 38, height: 24 },
  { id: "apple-pay", src: "/images/payments/apple-pay.svg", label: "Apple Pay", width: 38, height: 24 },
  { id: "google-pay", src: "/images/payments/google-pay.svg", label: "Google Pay", width: 38, height: 24 },
  { id: "mastercard", src: "/images/payments/mastercard.svg", label: "Mastercard", width: 38, height: 24 },
  { id: "shop-pay", src: "/images/payments/shop-pay.svg", label: "Shop Pay", width: 38, height: 24 },
  { id: "union-pay", src: "/images/payments/union-pay.svg", label: "Union Pay", width: 38, height: 24 },
  { id: "visa", src: "/images/payments/visa.svg", label: "Visa", width: 38, height: 24 },
] as const;

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className ?? ""}`}>
      {paymentMethods.map((method) => (
        <span
          key={method.id}
          className="inline-flex h-6 w-[38px] items-center justify-center overflow-hidden rounded-sm bg-white shadow-sm"
        >
          <Image
            src={method.src}
            alt={method.label}
            width={method.width}
            height={method.height}
            unoptimized
            className="h-full w-full object-contain object-center"
          />
        </span>
      ))}
    </div>
  );
}
