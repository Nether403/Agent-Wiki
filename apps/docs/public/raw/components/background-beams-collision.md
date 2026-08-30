---
id: "background-beams-collision"
name: "Background Beams Collision"
category: "ui:motion"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "tailwind-v4"
  - "brutalist"
  - "wai-aria-compliant"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Background Beams Collision (`background-beams-collision`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, brutalist, wai-aria-compliant
- **Design Dials**: Variance 7/10 · Motion 9/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add background-beams-collision

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/background-beams-collision.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Aceternity & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface BackgroundBeamsCollisionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function BackgroundBeamsCollision({ children, className, ...props }: BackgroundBeamsCollisionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newSpark = {
        id: Date.now() + Math.random(),
        x: Math.random() * rect.width,
        y: Math.random() * (rect.height * 0.6) + rect.height * 0.2,
      };
      setSparks((prev) => [...prev.slice(-6), newSpark]);
    }, 1200);

    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xs", className)}
      {...props}
    >
      {!prefersReduced && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Animated Diagonal Beams */}
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] bg-linear-to-br from-primary/10 via-transparent to-transparent blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] bg-linear-to-tl from-indigo-500/10 via-transparent to-transparent blur-3xl animate-pulse" />

          {/* Colliding Spark Particles */}
          <AnimatePresence>
            {sparks.map((s) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2.5, 0], opacity: [1, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]"
                style={{ left: s.x, top: s.y }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="relative z-10 w-full max-w-2xl text-center">{children}</div>
    </div>
  );
}

```
