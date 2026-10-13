"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { landingNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { CurrencySelector } from "@/components/layout/currency-selector";
import { useCart } from "@/contexts/cart-context";
import { useUserAuth } from "@/contexts/user-auth-context";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Start false to match SSR — updated after hydration to avoid hydration mismatch
  const [isJewellery, setIsJewellery] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useUserAuth();

  // Detect Fine Jewellery route client-side only (avoids SSR/client mismatch)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsJewellery(pathname === "/catalog" && params.get("category") === "jewellery");
  }, [pathname]);

  // Sync header height CSS variable for sticky offset calculations
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

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  // Only the logo changes — header always stays dark
  const logoVariant = isJewellery ? "jewellery" : "white";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black" suppressHydrationWarning>
      <Container>
        <nav className="flex h-20 items-center justify-between gap-4">
          <Logo size="md" variant={logoVariant} />

          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-10">
            {landingNavigation.map((item) => {
              const active =
                item.label === "Fine Jewellery"
                  ? isJewellery
                  : item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href.split("?")[0]) && !isJewellery;
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

            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-[140px] truncate font-manrope text-[11px] font-semibold normal-case tracking-normal text-white/80">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-manrope text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-rich-gold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden text-white transition-colors hover:text-rich-gold sm:inline-flex"
                aria-label="Login"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-white transition-colors hover:text-rich-gold"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-rich-gold px-1 font-manrope text-[9px] font-bold text-black">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
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
            {user ? (
              <>
                <p className="py-3 font-manrope text-sm font-semibold normal-case tracking-normal text-rich-gold">
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full py-3 text-left font-manrope text-sm font-semibold uppercase tracking-[0.12em] text-white/90 hover:text-rich-gold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-manrope text-sm font-semibold uppercase tracking-[0.12em] text-white/90 hover:text-rich-gold"
              >
                Login
              </Link>
            )}
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
