"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { NavGroup, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  item: NavItem;
  light?: boolean;
  onNavigate?: () => void;
}

export function NavDropdown({ item, light, onNavigate }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "label-caps whitespace-nowrap transition-colors",
          light ? "text-white hover:text-pale-gold" : "text-on-surface-variant hover:text-primary",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "label-caps inline-flex items-center gap-1 whitespace-nowrap transition-colors",
          light ? "text-white hover:text-pale-gold" : "text-on-surface-variant hover:text-primary",
          open && !light && "text-primary",
          open && light && "text-pale-gold",
        )}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-4">
          <div className="min-w-[520px] border border-border bg-white p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {item.children.map((group: NavGroup) => (
                <div key={group.label}>
                  {group.href ? (
                    <Link
                      href={group.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="label-caps mb-4 block text-rich-gold hover:text-deep-navy"
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <p className="label-caps mb-4 text-rich-gold">{group.label}</p>
                  )}
                  <ul className="space-y-2">
                    {group.children.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                          className="text-sm text-on-surface-variant transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileNavItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function MobileNavItem({ item, onNavigate }: MobileNavItemProps) {
  const [expanded, setExpanded] = useState(false);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="label-caps block py-3 text-on-surface-variant hover:text-primary"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="label-caps flex w-full items-center justify-between py-3 text-on-surface-variant"
        onClick={() => setExpanded(!expanded)}
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="space-y-4 pb-4 pl-4">
          {item.children.map((group) => (
            <div key={group.label}>
              <p className="label-caps mb-2 text-rich-gold">{group.label}</p>
              <ul className="space-y-2">
                {group.children.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="block text-sm text-on-surface-variant hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
