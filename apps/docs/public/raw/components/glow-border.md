---
id: "glow-border"
name: "Glow Border"
category: "ui:creative"
library_origin: "https://magicui.design"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "tailwind-v4"
  - "neon-scifi"
  - "wai-aria-compliant"
  - "magic-ui"
  - "glow"
  - "conic-gradient"
  - "creative"
  - "border"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Glow Border (`glow-border`)
> Rotating chromatic gradient glow border wrapper for cards, hero callouts, and featured sections.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, neon-scifi, wai-aria-compliant, magic-ui, glow, conic-gradient, creative, border
- **Design Dials**: Variance 7/10 · Motion 7/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add glow-border

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/glow-border.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI / Aceternity (https://ui.aceternity.com)
 * @author Magic UI & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderRadius?: number;
  color?: string[];
  duration?: number;
}

export function GlowBorder({
  borderRadius = 16,
  duration = 10,
  className,
  children,
  ...props
}: GlowBorderProps) {
  return (
    <div
      style={{ borderRadius: `${borderRadius}px` }}
      className={cn(
        "relative min-h-16 w-full p-px overflow-hidden bg-card text-card-foreground border border-border",
        className
      )}
      {...props}
    >
      {/* Animated glow ray */}
      <div
        aria-hidden="true"
        style={{
          borderRadius: `${borderRadius}px`,
          animationDuration: `${duration}s`,
        }}
        className="absolute inset-0 -z-10 animate-spin bg-[conic-gradient(from_0deg_at_50%_50%,hsl(var(--primary))_0deg,transparent_60deg,transparent_300deg,hsl(var(--primary))_360deg)] opacity-40 motion-reduce:hidden"
      />

      {/* Surface content container */}
      <div
        style={{ borderRadius: `${Math.max(0, borderRadius - 1)}px` }}
        className="relative z-10 h-full w-full bg-card p-6"
      >
        {children}
      </div>
    </div>
  );
}

```
