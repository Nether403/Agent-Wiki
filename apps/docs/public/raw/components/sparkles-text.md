---
id: "sparkles-text"
name: "Sparkles Text"
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
  - "typography"
  - "sparkles"
  - "headline"
  - "magicui"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Sparkles Text (`sparkles-text`)
> Dynamic SVG sparkle highlights superimposed on bold typographic headlines.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, wai-aria-compliant, motion, typography, sparkles, headline, magicui
- **Design Dials**: Variance 7/10 · Motion 7/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add sparkles-text

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/sparkles-text.json
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
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  duration: number;
}

export interface SparklesTextProps extends React.ComponentPropsWithoutRef<"span"> {
  text: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
  className?: string;
}

export function SparklesText({
  text,
  sparklesCount = 8,
  colors = { first: "#10b981", second: "#38bdf8" },
  className,
  ...props
}: SparklesTextProps) {
  const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (shouldReduceMotion) return;
    const generated: Sparkle[] = Array.from({ length: sparklesCount }, (_, i) => ({
      id: `sparkle-${i}`,
      x: `${Math.floor(Math.random() * 90)}%`,
      y: `${Math.floor(Math.random() * 80)}%`,
      color: i % 2 === 0 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 0.5 + 0.6,
      duration: Math.random() * 1.5 + 1.2,
    }));
    setSparkles(generated);
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <span
      className={cn("relative inline-block font-semibold tracking-tight", className)}
      {...props}
    >
      <span className="relative z-10">{text}</span>
      <span className="pointer-events-none absolute inset-0 block overflow-hidden" aria-hidden="true">
        {sparkles.map((sp) => (
          <motion.svg
            key={sp.id}
            className="absolute h-4 w-4"
            style={{ left: sp.x, top: sp.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, sp.scale, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: sp.duration,
              repeat: Infinity,
              delay: sp.delay,
              ease: "easeInOut",
            }}
            viewBox="0 0 24 24"
            fill="none"
            role="presentation"
          >
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill={sp.color}
            />
          </motion.svg>
        ))}
      </span>
    </span>
  );
}

```
