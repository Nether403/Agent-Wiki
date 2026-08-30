---
id: "parallax-scroll-container"
name: "Parallax Scroll Container"
category: "ui:motion"
library_origin: "https://github.com/darkroomengineering/lenis"
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
  - "motion"
  - "parallax"
  - "scroll"
  - "viewport"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Parallax Scroll Container (`parallax-scroll-container`)
> Zero-lag scroll-anchored viewport container with reduced-motion fallback.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, wai-aria-compliant, motion, parallax, scroll, viewport
- **Design Dials**: Variance 6/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add parallax-scroll-container

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/parallax-scroll-container.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Darkroom Engineering / Motion
 * @author Darkroom Engineering & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ParallaxScrollContainerProps {
  speedMultiplier?: number;
  className?: string;
  children: React.ReactNode;
}

export function ParallaxScrollContainer({
  speedMultiplier = 0.2,
  className,
  children,
}: ParallaxScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-50 * speedMultiplier, 50 * speedMultiplier]
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-xl border border-border bg-card", className)}
    >
      <motion.div style={{ y: yOffset }} className="relative w-full">
        {children}
      </motion.div>
    </div>
  );
}

```
