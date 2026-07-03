"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { landingNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { CurrencySelector } from "@/components/layout/currency-selector";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black">
      <Container>
        <nav className="flex h-20 items-center justify-between gap-4">
          <Logo size="md" className="brightness-0 invert" />

          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-10">
            {landingNavigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-manrope text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    active ? "text-rich-gold" : "text-white/80 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <CurrencySelector compact light className="hidden md:block" />

            <Link
              href="/book"
              className="hidden border border-rich-gold px-4 py-2.5 font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold transition-colors hover:bg-rich-gold hover:text-black sm:inline-flex"
            >
              Book Appointment
            </Link>

            <button
              type="button"
              className="text-white transition-colors hover:text-rich-gold lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-black transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[80vh] overflow-y-auto opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="py-5">
          <div className="mb-4 border-b border-white/10 pb-4 md:hidden">
            <CurrencySelector light />
          </div>
          <nav className="space-y-1">
            {landingNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-manrope text-sm font-semibold uppercase tracking-[0.12em] text-white/90 hover:text-rich-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="btn-stitch-gold mt-4 block text-center"
            >
              Book Appointment
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}
