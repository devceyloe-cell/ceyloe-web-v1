import Link from "next/link";
import { announcementBarConfig } from "@/config/announcement";
import { Container } from "@/components/ui/container";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-background">
      <Container>
        <Link
          href={announcementBarConfig.href}
          className="block py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-gold sm:text-[11px]"
        >
          {announcementBarConfig.message}
        </Link>
      </Container>
    </div>
  );
}
