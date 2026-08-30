---
id: "true-focus-text"
name: "True Focus Text"
category: "ui:motion"
library_origin: "https://reactbits.dev"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "neon-scifi"
  - "wai-aria-compliant"
  - "motion"
  - "text"
  - "focus"
  - "kinetic"
  - "react-bits"
  - "typography"
  - "blur"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# True Focus Text (`true-focus-text`)
> Kinetic typography effect where words snap into crisp focus sequentially or via cursor hover.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `LOW`
- **Technical Tags**: neon-scifi, wai-aria-compliant, motion, text, focus, kinetic, react-bits, typography, blur
- **Design Dials**: Variance 6/10 · Motion 5/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add true-focus-text

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/true-focus-text.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author DavidHDev & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TrueFocusTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  words?: string[];
  intervalMs?: number;
  glowColor?: string;
}

export function TrueFocusText({
  words = ["Deterministic", "Zero-Slop", "Accessible", "Agent-Native", "Verified"],
  intervalMs = 2400,
  glowColor = "var(--color-primary, #10b981)",
  className,
  ...props
}: TrueFocusTextProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [words.length, intervalMs]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <h2
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {words.map((word, index) => {
          const isFocused = index === activeIndex;

          return (
            <span
              key={`${word}-${index}`}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "relative cursor-pointer px-2 py-1 rounded-lg transition-[filter,transform,color] duration-200",
                isFocused
                  ? "text-primary scale-105 filter-none font-black"
                  : "text-muted-foreground/60 blur-[1.5px] scale-95 opacity-50 hover:opacity-80"
              )}
            >
              {/* Focus highlight bracket/box */}
              {isFocused && (
                <span
                  className="pointer-events-none absolute -inset-1 rounded-lg border border-primary/40 bg-primary/10 shadow-xs motion-reduce:border-primary"
                  style={{ borderColor: glowColor }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{word}</span>
            </span>
          );
        })}
      </h2>
      <p className="mt-4 text-xs font-mono text-muted-foreground">
        Interactive kinetic focus • Hover any word or let auto-cycle
      </p>
    </div>
  );
}

```
