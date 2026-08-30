/**
 * @license MIT
 * @origin Kairo UI / Tailark (https://kairoui.com)
 * @author Kairo UI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export interface HeroSectionProps {
  badge?: string;
  title: string;
  highlightedText?: string;
  description: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  className?: string;
}

export function HeroSection({
  badge = "Agent-Native Design System v1.0",
  title = "Deterministic UI Engineering for",
  highlightedText = "Autonomous AI Agents",
  description = "Eliminate AI slop, chained type assertions, and unstyled layout errors. Ground your coding models in pre-tested, accessible component primitives.",
  primaryCtaText = "Explore Registry",
  secondaryCtaText = "Initialize MCP",
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-background px-6 py-20 text-center sm:px-12 lg:py-28",
        className
      )}
    >
      <div className="mx-auto max-w-3xl">
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>{badge}</span>
        </div>

        {/* Title with typographic hierarchy */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {title}{" "}
          <span className="text-primary underline decoration-primary/30 underline-offset-8">
            {highlightedText}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onPrimaryCtaClick}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onSecondaryCtaClick}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>{secondaryCtaText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
