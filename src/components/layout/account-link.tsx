"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountLinkProps {
  className?: string;
  isLoggedIn?: boolean;
}

export function AccountLink({ className, isLoggedIn }: AccountLinkProps) {
  return (
    <Link
      href={isLoggedIn ? "/account" : "/api/auth/shopify/login"}
      className={cn(
        "label-caps inline-flex items-center gap-1.5 text-on-surface-variant transition-colors hover:text-rich-gold",
        className,
      )}
    >
      <User className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{isLoggedIn ? "Account" : "Login"}</span>
    </Link>
  );
}
