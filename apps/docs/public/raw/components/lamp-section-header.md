---
id: "lamp-section-header"
name: "Lamp Section Header"
category: "ui:block"
library_origin: "https://ui.aceternity.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "glassmorphism"
  - "neon-scifi"
  - "wai-aria-compliant"
  - "layout-block"
  - "hero"
  - "header"
  - "lamp"
  - "spotlight"
  - "aceternity"
  - "glow"
  - "gradient"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Lamp Section Header (`lamp-section-header`)
> Conical spotlight lamp header effect with gradient light beam pouring down over titles and subtitles.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: glassmorphism, neon-scifi, wai-aria-compliant, layout-block, hero, header, lamp, spotlight, aceternity, glow, gradient
- **Design Dials**: Variance 8/10 · Motion 5/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add lamp-section-header

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/lamp-section-header.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Aceternity & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface LampSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  lampColor?: string;
}

export function LampSectionHeader({
  badgeText = "Curated Registry",
  headline = "Deterministic UI for Autonomous Agents",
  subheadline = "High-performance primitives, verified token contracts, and instant Model Context Protocol resolution.",
  lampColor = "var(--color-primary, #10b981)",
  className,
  ...props
}: LampSectionHeaderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[440px] overflow-hidden bg-background w-full z-0 text-center px-4 py-16",
        className
      )}
      {...props}
    >
      {/* Conical Lamp Glow Cone Beam */}
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 pointer-events-none">
        {/* Left Glowing Beam Wedge */}
        <div
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-primary via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] opacity-50 blur-2xl"
          style={{ backgroundImage: `conic-gradient(from 70deg at center top, ${lampColor}, transparent 60%)` }}
          aria-hidden="true"
        />

        {/* Right Glowing Beam Wedge */}
        <div
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary text-white [--conic-position:from_290deg_at_center_top] opacity-50 blur-2xl"
          style={{ backgroundImage: `conic-gradient(from 290deg at center top, transparent 40%, ${lampColor})` }}
          aria-hidden="true"
        />

        {/* Top Lamp Horizontal Light Strip */}
        <div
          className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"
          aria-hidden="true"
        />
        <div
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-primary opacity-30 blur-3xl"
          style={{ backgroundColor: lampColor }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-primary/40 blur-2xl"
          style={{ backgroundColor: lampColor }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-primary"
          style={{ backgroundColor: lampColor }}
          aria-hidden="true"
        />
      </div>

      {/* Foreground Header Content */}
      <div className="relative z-50 flex -translate-y-8 flex-col items-center px-4 max-w-3xl">
        {badgeText && (
          <span className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-xs">
            {badgeText}
          </span>
        )}

        <h2 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl md:text-6xl">
          {headline}
        </h2>

        <p className="mt-4 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subheadline}
        </p>
      </div>
    </div>
  );
}

```
