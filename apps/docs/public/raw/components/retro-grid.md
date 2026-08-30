---
id: "retro-grid"
name: "Retro Grid"
category: "ui:creative"
library_origin: "https://github.com/magicuidesign/magicui"
dependencies:
  - "motion"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "creative"
  - "grid"
  - "retro"
  - "magic-ui"
  - "3d"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Retro Grid (`retro-grid`)
> Isometric 3D scrolling grid with linear top-to-bottom opacity fade and perspective horizon.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, wai-aria-compliant, creative, grid, retro, magic-ui, 3d
- **Design Dials**: Variance 7/10 · Motion 5/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add retro-grid

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/retro-grid.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI (https://github.com/magicuidesign/magicui)
 * @author Magic UI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface RetroGridProps {
  angle?: number;
  className?: string;
  children?: React.ReactNode;
}

export function RetroGrid({
  angle = 65,
  className,
  children,
}: RetroGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-12 text-foreground",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]"
        aria-hidden="true"
      >
        {/* Animated grid plane */}
        <div
          className={cn(
            "absolute inset-0 [transform-origin:100%_0_0]",
            !shouldReduceMotion && "motion-safe:animate-grid"
          )}
          style={{
            transform: `rotateX(${angle}deg)`,
            backgroundImage: `linear-gradient(to right, rgba(120, 120, 120, 0.2) 1px, transparent 0),
                              linear-gradient(to bottom, rgba(120, 120, 120, 0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            backgroundRepeat: "repeat",
            height: "300%",
            marginLeft: "-50%",
            transformOrigin: "50% 0",
            width: "200%",
          }}
        />
      </div>

      {/* Linear top-to-bottom opacity fade */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

```
