"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CurrencyProvider } from "@/contexts/currency-context";
import { WhatsAppFab } from "@/components/widgets/whatsapp-fab";
import { LiveChatWidget } from "@/components/widgets/live-chat-widget";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CompareProvider>
      <CurrencyProvider>
      <Header />
      <main className={cn("bg-background", isHome ? "pt-[6.75rem] md:pt-[7.25rem]" : "pt-[6.75rem] md:pt-[7.25rem]")}>{children}</main>
      <Footer />
      <WhatsAppFab />
      <LiveChatWidget />
      </CurrencyProvider>
    </CompareProvider>
  );
}
