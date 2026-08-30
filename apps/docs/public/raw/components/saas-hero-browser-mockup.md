---
id: "saas-hero-browser-mockup"
name: "Saas Hero Browser Mockup"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Saas Hero Browser Mockup (`saas-hero-browser-mockup`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add saas-hero-browser-mockup

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/saas-hero-browser-mockup.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, Sparkles, ShieldCheck, Terminal } from "lucide-react";

export interface SaasHeroBrowserMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
}

export function SaasHeroBrowserMockup({
  badgeText = "Machine-First Design System v2.0",
  headline = "Eliminate AI Slop with Verified UI Registries",
  subheadline = "100+ production React components, 30 anti-slop quality rules, and native sub-15KB MCP discovery for Claude Code, Cursor, and Hermes.",
  primaryCtaText = "Get Started",
  secondaryCtaText = "Read Documentation",
  onPrimaryCta,
  onSecondaryCta,
  className,
  ...props
}: SaasHeroBrowserMockupProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 overflow-hidden bg-background text-foreground",
        className
      )}
      {...props}
    >
      {/* Background radial gradient accent */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6 shadow-xs">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{badgeText}</span>
      </div>

      {/* Headline & Subheadline */}
      <h1 className="max-w-4xl text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15] mb-6">
        {headline}
      </h1>
      <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
        {subheadline}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          type="button"
          onClick={onPrimaryCta}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{primaryCtaText}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onSecondaryCta}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs md:text-sm font-semibold transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Terminal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{secondaryCtaText}</span>
        </button>
      </div>

      {/* Browser Window Mockup */}
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/80" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-background border border-border text-[11px] font-mono text-muted-foreground w-64 justify-center">
            <ShieldCheck className="h-3 w-3 text-emerald-500" aria-hidden="true" />
            <span>agent-wiki.dev/r/floating-dock</span>
          </div>

          <div className="w-12" />
        </div>

        {/* Mockup Canvas Screen */}
        <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[260px] bg-background/50">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-md">
              W
            </div>
            <h4 className="text-sm font-bold text-foreground">Interactive Component Canvas</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Live AST parser and 1-10 Dial Classifier running inside a strict 15KB context envelope.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

```
