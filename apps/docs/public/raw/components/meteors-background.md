---
id: "meteors-background"
name: "Meteors Background"
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
  - "brutalist"
  - "wai-aria-compliant"
  - "creative"
  - "background"
  - "meteors"
  - "magic-ui"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Meteors Background (`meteors-background`)
> Pure CSS/Tailwind animated shooting star and meteor backdrop with reduced-motion support.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, brutalist, wai-aria-compliant, creative, background, meteors, magic-ui
- **Design Dials**: Variance 7/10 · Motion 6/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add meteors-background

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/meteors-background.json
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

import React, { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface MeteorsBackgroundProps {
  number?: number;
  className?: string;
  children?: React.ReactNode;
}

interface MeteorStyle {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

export function MeteorsBackground({
  number = 20,
  className,
  children,
}: MeteorsBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  const meteors = useMemo<MeteorStyle[]>(() => {
    const list: MeteorStyle[] = [];
    for (let i = 0; i < number; i++) {
      list.push({
        top: `${Math.floor(Math.random() * 80) - 20}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        animationDelay: `${(Math.random() * 1 + 0.2).toFixed(2)}s`,
        animationDuration: `${Math.floor(Math.random() * 8 + 4)}s`,
      });
    }
    return list;
  }, [number]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-card p-8 text-foreground",
        className
      )}
    >
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {meteors.map((style, idx) => (
            <span
              key={idx}
              className="absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-primary/80 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-12 before:h-[1px] before:bg-gradient-to-r before:from-primary before:to-transparent"
              style={{
                top: style.top,
                left: style.left,
                animation: `meteor ${style.animationDuration} linear infinite`,
                animationDelay: style.animationDelay,
              }}
            />
          ))}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

```
