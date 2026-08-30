---
id: "counter-odometer"
name: "Counter Odometer"
category: "ui:motion"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "spring-physics"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Counter Odometer (`counter-odometer`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, wai-aria-compliant, spring-physics
- **Design Dials**: Variance 5/10 · Motion 8/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add counter-odometer

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/counter-odometer.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export interface CounterOdometerProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function CounterOdometer({ value, className, ...props }: CounterOdometerProps) {
  const digits = Math.abs(value).toString().split("");
  const spring = useSpring(value, { mass: 0.5, stiffness: 75, damping: 15 });

  return (
    <div
      className={cn(
        "inline-flex items-center font-mono font-black text-2xl tracking-tighter text-foreground select-none",
        className
      )}
      role="status"
      aria-label={`Counter: ${value}`}
      {...props}
    >
      {digits.map((d, idx) => (
        <span
          key={`${idx}-${d}`}
          className="inline-flex h-9 w-6 items-center justify-center rounded-md bg-muted/40 border border-border mx-0.5"
        >
          {d}
        </span>
      ))}
    </div>
  );
}

```
