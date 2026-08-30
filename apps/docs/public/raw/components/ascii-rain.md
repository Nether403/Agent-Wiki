---
id: "ascii-rain"
name: "Ascii Rain"
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

# Ascii Rain (`ascii-rain`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ascii-rain

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ascii-rain.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface AsciiRainProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: number;
}

export function AsciiRain({ density = 30, className, ...props }: AsciiRainProps) {
  const [lines, setLines] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setLines(Array.from({ length: 8 }, () => "█▓▒░ [REDUCED MOTION] ░▒▓█"));
      return;
    }

    const chars = " .:-=+*#%@";
    const interval = setInterval(() => {
      setLines(
        Array.from({ length: 12 }, () =>
          Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        )
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre
      className={cn(
        "p-4 rounded-xl border border-border bg-black font-mono text-[10px] text-emerald-500/80 leading-none overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="ASCII Terminal Rain Matrix"
      {...props}
    >
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </pre>
  );
}

```
