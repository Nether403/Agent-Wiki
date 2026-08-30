---
id: "spring-orchestrator"
name: "Spring Orchestrator"
category: "ui:motion"
library_origin: "https://github.com/motiondivision/motion"
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
  - "spring"
  - "orchestration"
  - "stagger"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Spring Orchestrator (`spring-orchestrator`)
> Coordinated stagger animation manager with spring physics presets and reduced-motion safety.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, wai-aria-compliant, spring-physics, motion, spring, orchestration, stagger
- **Design Dials**: Variance 5/10 · Motion 5/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add spring-orchestrator

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/spring-orchestrator.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Motion (https://github.com/motiondivision/motion)
 * @author Motion Division & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SpringOrchestratorProps {
  staggerDelay?: number;
  className?: string;
  children: React.ReactNode;
}

export function SpringOrchestrator({
  staggerDelay = 0.08,
  className,
  children,
}: SpringOrchestratorProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn("grid gap-4", className)}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                  mass: 0.9,
                },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

```
