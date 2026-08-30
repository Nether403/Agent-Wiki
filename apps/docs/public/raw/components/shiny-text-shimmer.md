---
id: "shiny-text-shimmer"
name: "Shiny Text Shimmer"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Shiny Text Shimmer (`shiny-text-shimmer`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add shiny-text-shimmer

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/shiny-text-shimmer.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI & React Bits (https://magicui.design / https://reactbits.dev)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface ShinyTextShimmerProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  disabled?: boolean;
  speed?: number;
}

export function ShinyTextShimmer({
  text,
  disabled = false,
  speed = 4,
  className,
  ...props
}: ShinyTextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent font-medium",
        !disabled && "animate-shiny-text",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: `${speed}s`,
      }}
      {...props}
    >
      <span className="text-foreground">{text}</span>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shiny-text {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
          .animate-shiny-text {
            animation: shiny-text 4s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-shiny-text {
              animation: none !important;
            }
          }
        `,
      }} />
    </span>
  );
}

```
