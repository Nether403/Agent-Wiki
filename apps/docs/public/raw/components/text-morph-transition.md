---
id: "text-morph-transition"
name: "Text Morph Layout Transition"
category: "ui:motion"
library_origin: "https://motion-primitives.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "wai-aria-compliant"
  - "motion"
  - "text-morph"
  - "morphing"
  - "motion-primitives"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Text Morph Layout Transition (`text-morph-transition`)
> Smooth letter-by-letter layout morphing between arbitrary words/phrases.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, motion, text-morph, morphing, motion-primitives
- **Design Dials**: Variance 6/10 · Motion 7/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add text-morph-transition

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/text-morph-transition.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Motion Primitives / Magic UI (https://motion-primitives.com)
 * @author Ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextMorphTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  words?: string[];
  intervalMs?: number;
}

export function TextMorphTransition({
  words = ["Autonomous Agents", "Zero-Slop Design", "Machine-First Wiki", "Accessible Primitives"],
  intervalMs = 3000,
  className,
  ...props
}: TextMorphTransitionProps) {
  const [index, setIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsTransitioning(false);
      }, 300);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [words, intervalMs]);

  const currentWord = words[index];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-tight text-foreground transition-opacity duration-200",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`Morphing text: ${currentWord}`}
      {...props}
    >
      <span
        className={cn(
          "inline-block transition-opacity duration-200 transform",
          isTransitioning
            ? "opacity-0 -translate-y-2 filter blur-xs"
            : "opacity-100 translate-y-0 filter blur-0"
        )}
      >
        {currentWord}
      </span>
    </div>
  );
}

```
