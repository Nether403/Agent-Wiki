---
id: "interactive-hover-button"
name: "Interactive Hover Button"
category: "ui:motion"
library_origin: "https://github.com/codse/animata"
dependencies:
  - "motion"
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "spring-physics"
  - "motion"
  - "button"
  - "interactive"
  - "hover"
  - "animata"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Interactive Hover Button (`interactive-hover-button`)
> Magnetic particle expansion button with smooth spring scale and focus-visible indicators.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, spring-physics, motion, button, interactive, hover, animata
- **Design Dials**: Variance 5/10 · Motion 6/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add interactive-hover-button

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/interactive-hover-button.json
```

## Peer Dependencies
- `motion`
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Animata / Magic UI
 * @author Animata Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
}

export function InteractiveHoverButton({
  text = "Explore Registry",
  className,
  ref,
  ...props
}: InteractiveHoverButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border border-border bg-background px-6 py-2.5 text-center font-medium text-foreground transition-colors duration-200 hover:bg-muted/40 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <span className="inline-block transition-transform transition-opacity duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-transform transition-opacity duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span className="text-sm font-semibold">{text}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>

      {!shouldReduceMotion && (
        <motion.div
          className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-primary transition-transform duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]"
          initial={false}
          animate={{ scale: isHovered ? 1.8 : 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
        />
      )}
    </button>
  );
}

```
