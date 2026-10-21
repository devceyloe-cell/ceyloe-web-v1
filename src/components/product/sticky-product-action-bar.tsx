"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MessageCircle, ShoppingBag } from "lucide-react";
import { Price } from "@/components/ui/price";
import { useCart } from "@/contexts/cart-context";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types";
import { isProductPurchasable } from "@/lib/product-availability";
import { cn } from "@/lib/utils";

interface StickyProductActionBarProps {
  product: Product;
  productUrl: string;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function StickyProductActionBar({
  product,
  productUrl,
  sentinelRef,
}: StickyProductActionBarProps) {
  const { addItem, hasItem } = useCart();
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinelRef]);

  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    `Hello, I would like more information about the ${product.title}.\n${productUrl}`,
  )}`;

  const inCart = hasItem(product.handle);
  const purchasable = isProductPurchasable(product);

  async function handleAdd() {
    if (!purchasable || adding || inCart) return;
    setAdding(true);
    const result = addItem(product);
    if (result.reason === "auth") {
      window.location.href = `/login?next=${encodeURIComponent(productUrl)}`;
      return;
    }
    window.setTimeout(() => setAdding(false), 400);
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0B0B]/95 backdrop-blur-md transition-transform duration-300 pb-[env(safe-area-inset-bottom)]",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-[var(--margin-mobile)] py-3 md:gap-5 md:px-[var(--margin-desktop)]">
        <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden bg-[#111] sm:block">
          <Image
            src={product.image}
            alt=""
            fill
            className="object-cover object-center"
            sizes="48px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-caslon truncate text-[14px] !text-white md:text-[16px]">
            {product.title}
          </p>
          <div className="font-manrope flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px]">
            {product.specs.origin && (
              <span className="truncate text-white/55">{product.specs.origin}</span>
            )}
            <span className="font-semibold text-rich-gold">
              <Price amount={product.price} />
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {purchasable && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || inCart}
              className="hidden min-h-11 items-center gap-1.5 border border-rich-gold px-3 font-manrope text-[10px] font-bold tracking-[0.12em] text-rich-gold uppercase transition-colors hover:bg-rich-gold hover:text-black disabled:opacity-50 sm:inline-flex"
            >
              {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingBag className="h-3.5 w-3.5" />}
              {inCart ? "In Cart" : "Add to Cart"}
            </button>
          )}
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center bg-rich-gold px-3 font-manrope text-[10px] font-bold tracking-[0.12em] text-black uppercase transition-colors hover:bg-[#c49a4a]"
          >
            Book
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
