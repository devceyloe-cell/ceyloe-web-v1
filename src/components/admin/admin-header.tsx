"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminUser = {
  username: string;
  role: string;
};

function formatRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrator";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function AdminHeader({ title }: { title?: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/admin" className="shrink-0 text-xs uppercase tracking-[0.2em] text-gold">
            Ceyloe Admin
          </Link>
          {title && (
            <>
              <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
              <span className="truncate text-sm text-muted">{title}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-gold"
            target="_blank"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>

          {user && (
            <div className="flex items-center gap-3 border border-border bg-background px-3 py-2">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold uppercase tracking-wide text-gold"
                aria-hidden
              >
                {initials(user.username)}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium text-foreground">{user.username}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  {formatRole(user.role)}
                </p>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={logout}
            className="inline-flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
