---
id: "noise-texture-card"
name: "Noise Texture Card"
category: "ui:creative"
library_origin: "https://reactbits.dev"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "svg-noise"
  - "editorial"
  - "texture"
  - "brutalist"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Noise Texture Card (`noise-texture-card`)
> High-craft noise-dithered backdrop with crisp typography overlay and zero AI slop.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, svg-noise, editorial, texture, brutalist
- **Design Dials**: Variance 7/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add noise-texture-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/noise-texture-card.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author React Bits Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface NoiseTextureCardProps {
  title: string;
  subtitle?: string;
  description: string;
  tag?: string;
  className?: string;
}

export function NoiseTextureCard({
  title,
  subtitle,
  description,
  tag = "Creative Engine",
  className,
}: NoiseTextureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm transition-all hover:border-border/80 hover:shadow-md",
        className
      )}
    >
      {/* Micro SVG Noise Texture Pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20 transition-opacity group-hover:opacity-30"
        aria-hidden="true"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <div className="relative z-10">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          {tag}
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

```
