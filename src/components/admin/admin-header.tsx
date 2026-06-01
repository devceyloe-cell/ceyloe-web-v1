"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminHeader({ title }: { title?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xs uppercase tracking-[0.2em] text-gold">
            Ceyloe Admin
          </Link>
          {title && <span className="text-sm text-muted">{title}</span>}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-muted hover:text-gold" target="_blank">
            View site
          </Link>
          <Button type="button" variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
