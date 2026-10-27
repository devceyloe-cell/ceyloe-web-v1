"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CurrencyProvider } from "@/contexts/currency-context";
import { UserAuthProvider } from "@/contexts/user-auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { SiteBackground } from "@/components/layout/site-background";

const WhatsAppFab = dynamic(
  () => import("@/components/widgets/whatsapp-fab").then((m) => m.WhatsAppFab),
  { ssr: false },
);

const LiveChatWidget = dynamic(
  () => import("@/components/widgets/live-chat-widget").then((m) => m.LiveChatWidget),
  { ssr: false },
);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const hideSketchBackground =
    pathname === "/gemstones" ||
    pathname.startsWith("/gemstones/") ||
    pathname === "/catalog" ||
    pathname === "/custom-jewelry" ||
    pathname === "/about" ||
    pathname === "/journal" ||
    pathname === "/contact" ||
    pathname === "/book" ||
    pathname === "/cart";

  if (isAdmin) {
    return <CurrencyProvider>{children}</CurrencyProvider>;
  }

  return (
    <CompareProvider>
      <CurrencyProvider>
        <UserAuthProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              {!hideSketchBackground ? (
                <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                  <SiteBackground />
                </div>
              ) : null}
              <Header />
              <main className="relative flex-1 pt-[var(--site-header-height)]">{children}</main>
              <Footer />
            </div>
            <WhatsAppFab />
            <LiveChatWidget />
          </CartProvider>
        </UserAuthProvider>
      </CurrencyProvider>
    </CompareProvider>
  );
}
