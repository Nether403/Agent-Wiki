/**
 * @license MIT
 * @origin Tailark / Shadcn (https://tailark.com)
 * @author Tailark Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { Menu, X, Terminal } from "lucide-react";
import { cn } from "../lib/utils";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarStickyProps {
  brandName?: string;
  links?: NavLink[];
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Overview", href: "#overview" },
  { label: "Components", href: "#components" },
  { label: "Taste Matrix", href: "#matrix" },
  { label: "MCP Protocol", href: "#mcp" },
];

export function NavbarSticky({
  brandName = "Design Wiki",
  links = defaultLinks,
  actionLabel = "Get Started",
  onActionClick,
  className,
}: NavbarStickyProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono font-bold">
            W
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            {brandName}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onActionClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{actionLabel}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onActionClick?.();
              }}
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground text-center"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
