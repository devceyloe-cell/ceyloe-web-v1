import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="section-bg">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <CheckCircle className="h-14 w-14 text-gold" />
        <h1 className="font-display mt-6 text-3xl font-light sm:text-4xl">Thank you for your order</h1>
        <p className="mt-4 max-w-md text-muted">
          Your payment was processed securely by Stripe. Our team will contact you shortly to
          confirm delivery and certification details.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/catalog">
            <Button>Continue shopping</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact us</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
