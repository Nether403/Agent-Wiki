---
id: "dither-noise-card"
name: "Dither Noise Card"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Dither Noise Card (`dither-noise-card`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add dither-noise-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/dither-noise-card.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Paper Shaders & React Bits (https://github.com/paper-design/shaders)
 * @author Paper Design & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DitherNoiseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  grainOpacity?: number;
  interactive?: boolean;
}

export function DitherNoiseCard({
  children,
  grainOpacity = 0.08,
  interactive = true,
  className,
  ...props
}: DitherNoiseCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card p-6 shadow-xs overflow-hidden text-card-foreground",
        interactive && "transition-colors duration-200 hover:border-primary/50",
        className
      )}
      {...props}
    >
      {/* SVG Dither Filter Overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] contrast-125 dark:opacity-[0.12]"
        aria-hidden="true"
      >
        <filter id="dither-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dither-noise-filter)" />
      </svg>

      {/* Card Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

```
