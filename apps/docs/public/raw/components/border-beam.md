---
id: "border-beam"
name: "Border Beam"
category: "ui:motion"
library_origin: "https://github.com/magicuidesign/magicui"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "wai-aria-compliant"
  - "motion"
  - "border"
  - "glow"
  - "visual-effects"
  - "magicui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Border Beam (`border-beam`)
> Animated border glow highlight tracing container boundaries with gradient light.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, motion, border, glow, visual-effects, magicui
- **Design Dials**: Variance 6/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add border-beam

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/border-beam.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @origin Magic UI (https://github.com/magicuidesign/magicui)
 * @license MIT
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#10b981",
  colorTo = "#38bdf8",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "motion-reduce:hidden",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
      aria-hidden="true"
    />
  );
}

```
