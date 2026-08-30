---
id: "dot-matrix-scoreboard"
name: "Dot Matrix Scoreboard"
category: "ui:utility"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "utility"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Dot Matrix Scoreboard (`dot-matrix-scoreboard`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, utility
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add dot-matrix-scoreboard

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/dot-matrix-scoreboard.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Cult UI / Agent Wiki (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DotMatrixScoreboardProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  dotSize?: number;
  gap?: number;
}

// 5x7 dot matrix font map for basic characters
const GLYPHS: Record<string, number[][]> = {
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  A: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  G: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

export function DotMatrixScoreboard({
  text = "AGENT 01",
  dotSize = 5,
  gap = 2,
  className,
  ...props
}: DotMatrixScoreboardProps) {
  const chars = text.toUpperCase().split("");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 p-4 rounded-xl border border-border bg-card dark:bg-black shadow-inner",
        className
      )}
      role="status"
      aria-label={`Dot Matrix Scoreboard: ${text}`}
      {...props}
    >
      {chars.map((char, charIdx) => {
        const matrix = GLYPHS[char] || GLYPHS["0"];
        return (
          <div key={`${charIdx}-${char}`} className="flex flex-col" style={{ gap: `${gap}px` }}>
            {matrix.map((row, rowIdx) => (
              <div key={rowIdx} className="flex" style={{ gap: `${gap}px` }}>
                {row.map((active, colIdx) => (
                  <span
                    key={colIdx}
                    style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
                    className={cn(
                      "rounded-full transition-colors",
                      active ? "bg-amber-400 shadow-xs shadow-amber-400" : "bg-neutral-800/80"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

```
