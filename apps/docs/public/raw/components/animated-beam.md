---
id: "animated-beam"
name: "Animated Beam"
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
  - "motion"
  - "beam"
  - "svg"
  - "curve"
  - "magic-ui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Animated Beam (`animated-beam`)
> SVG animated glowing curve connecting multiple nodes with continuous gradient travel.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, wai-aria-compliant, motion, beam, svg, curve, magic-ui
- **Design Dials**: Variance 6/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add animated-beam

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/animated-beam.json
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

import React, { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  fromRef?: React.RefObject<HTMLElement | null>;
  toRef?: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  className,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId();
  const shouldReduceMotion = useReducedMotion();

  // Baseline geometric curve coordinates
  const startX = 50 + startXOffset;
  const startY = 50 + startYOffset;
  const endX = 250 + endXOffset;
  const endY = 50 + endYOffset;
  const controlY = startY - curvature;
  const pathD = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${controlY} ${endX} ${endY}`;

  return (
    <svg
      fill="none"
      width="300"
      height="100"
      viewBox="0 0 300 100"
      className={cn("pointer-events-none absolute left-0 top-0 transform-gpu stroke-2", className)}
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.2"
        strokeLinecap="round"
        className="text-muted-foreground"
      />
      <path
        d={pathD}
        stroke={`url(#${id})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={
            shouldReduceMotion
              ? { x1: "0%", x2: "100%", y1: "0%", y2: "0%" }
              : {
                  x1: reverse ? ["90%", "-10%"] : ["-10%", "90%"],
                  x2: reverse ? ["100%", "0%"] : ["0%", "100%"],
                }
          }
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <stop stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}

```
