---
id: "smooth-scroll-provider"
name: "Smooth Scroll Provider"
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
  - "wai-aria-compliant"
  - "motion"
  - "scroll"
  - "lenis"
  - "smooth-scroll"
  - "context"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Smooth Scroll Provider (`smooth-scroll-provider`)
> Context wrapper managing Lenis smooth-scrolling with accessibility-respecting reduced-motion bypass.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, wai-aria-compliant, motion, scroll, lenis, smooth-scroll, context
- **Design Dials**: Variance 4/10 · Motion 5/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add smooth-scroll-provider

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/smooth-scroll-provider.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Lenis (https://github.com/darkroomengineering/lenis)
 * @author Darkroom Engineering & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface SmoothScrollContextType {
  isSmoothEnabled: boolean;
  scrollTo: (target: string | number | HTMLElement) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  isSmoothEnabled: true,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
  duration?: number;
}

export function SmoothScrollProvider({
  children,
  duration = 1.2,
}: SmoothScrollProviderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isSmoothEnabled, setIsSmoothEnabled] = useState<boolean>(!shouldReduceMotion);

  useEffect(() => {
    setIsSmoothEnabled(!shouldReduceMotion);
    if (shouldReduceMotion) return;

    // Apply smooth scroll class to root html element safely
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [shouldReduceMotion]);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: shouldReduceMotion ? "auto" : "smooth" });
    } else if (typeof target === "string") {
      const element = document.querySelector(target);
      element?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <SmoothScrollContext value={{ isSmoothEnabled, scrollTo }}>
      {children}
    </SmoothScrollContext>
  );
}

```
