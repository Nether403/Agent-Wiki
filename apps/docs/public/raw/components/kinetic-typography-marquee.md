---
id: "kinetic-typography-marquee"
name: "Kinetic Typography Marquee"
category: "ui:creative"
library_origin: "https://github.com/motiondivision/motion"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "motion"
  - "paper-shaders"
  - "kinetic-type"
  - "marquee"
  - "typography"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Kinetic Typography Marquee (`kinetic-typography-marquee`)
> Variable font weight stream with smooth infinite CSS loop, edge masking, and prefers-reduced-motion support.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, motion, paper-shaders, kinetic-type, marquee, typography
- **Design Dials**: Variance 8/10 · Motion 8/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add kinetic-typography-marquee

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/kinetic-typography-marquee.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @origin Motion Division & Paper Shaders (https://github.com/motiondivision/motion, https://github.com/paper-design/shaders)
 * @license MIT
 * @author Motion Division & Paper Design
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface KineticTypographyMarqueeProps {
  phrases?: string[];
  speed?: number; // duration in seconds e.g. 20
  direction?: "left" | "right";
  className?: string;
}

const DEFAULT_PHRASES = [
  "DETERMINISTIC UI ARCHITECTURE",
  "ZERO-SLOP AGENT PROTOCOL",
  "MODEL CONTEXT PROTOCOL",
  "100% WCAG 2.1 AA COMPLIANT",
  "TAILWIND V4 NATIVE",
];

export function KineticTypographyMarquee({
  phrases = DEFAULT_PHRASES,
  speed = 25,
  direction = "left",
  className,
}: KineticTypographyMarqueeProps) {
  const repeatedText = phrases.join("  ✦  ");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-border bg-background py-4 select-none",
        className
      )}
      role="region"
      aria-label="Kinetic Typography Stream"
    >
      <div
        className={cn(
          "flex whitespace-nowrap will-change-transform",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-foreground/90 uppercase px-4">
          {repeatedText}  ✦  {repeatedText}
        </span>
      </div>

      {/* Edge Gradient Mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

```
