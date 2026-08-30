---
id: "number-ticker"
name: "Number Ticker"
category: "ui:motion"
library_origin: "https://github.com/magicuidesign/magicui"
dependencies:
  - "motion"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "wai-aria-compliant"
  - "spring-physics"
  - "motion"
  - "counter"
  - "ticker"
  - "spring"
  - "magicui"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Number Ticker (`number-ticker`)
> Accessible spring-animated number counter for statistics, metrics, and KPI indicators.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, wai-aria-compliant, spring-physics, motion, counter, ticker, spring, magicui
- **Design Dials**: Variance 5/10 · Motion 6/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add number-ticker

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/number-ticker.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Magic UI (https://github.com/magicuidesign/magicui)
 * @license MIT
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "../lib/utils";

export interface NumberTickerProps extends React.ComponentPropsWithoutRef<"span"> {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces]
  );

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block font-mono tracking-wider tabular-nums text-foreground",
        className
      )}
      aria-label={String(value)}
      {...props}
    />
  );
}

```
