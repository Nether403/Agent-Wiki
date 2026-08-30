---
id: "marquee"
name: "Marquee"
category: "ui:motion"
library_origin: "https://magicui.design"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "wai-aria-compliant"
  - "magic-ui"
  - "marquee"
  - "animation"
  - "ticker"
  - "loop"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Marquee (`marquee`)
> Infinite content stream marquee with pause-on-hover, velocity controls, and reduced-motion disablement.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, magic-ui, marquee, animation, ticker, loop
- **Design Dials**: Variance 5/10 · Motion 6/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add marquee

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/marquee.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI (https://magicui.design)
 * @author Dillion Verma & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  children,
  pauseOnHover = true,
  direction = "left",
  speed = "normal",
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const durationMap = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  return (
    <div
      aria-label="Scrolling Content Stream"
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          style={{ animationDuration: durationMap[speed] }}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)] animate-marquee",
            vertical && "flex-col",
            direction === "right" && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            "motion-reduce:animate-none"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

```
