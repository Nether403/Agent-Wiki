---
id: "kinetic-title-card"
name: "Kinetic Title Card"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Kinetic Title Card (`kinetic-title-card`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add kinetic-title-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/kinetic-title-card.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Remocn / Remotion (https://remotion.dev)
 * @author Remotion & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface KineticTitleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function KineticTitleCard({
  title,
  subtitle,
  badge = "SCENE 01",
  className,
  ...props
}: KineticTitleCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-12 rounded-2xl border border-border bg-card text-card-foreground shadow-xl overflow-hidden text-center aspect-video max-w-xl mx-auto select-none",
        className
      )}
      role="region"
      aria-label={`Kinetic Title Card: ${title}`}
      {...props}
    >
      {/* Mesh backdrop */}
      <div
        className="absolute inset-0 bg-radial from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {badge && (
        <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary uppercase mb-3">
          {badge}
        </span>
      )}

      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

```
