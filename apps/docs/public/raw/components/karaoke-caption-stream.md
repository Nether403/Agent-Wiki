---
id: "karaoke-caption-stream"
name: "Karaoke Caption Stream"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "tailwind-v4"
  - "brutalist"
  - "wai-aria-compliant"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Karaoke Caption Stream (`karaoke-caption-stream`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, brutalist, wai-aria-compliant
- **Design Dials**: Variance 5/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add karaoke-caption-stream

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/karaoke-caption-stream.json
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

export interface CaptionWord {
  text: string;
  startMs: number;
  endMs: number;
}

export interface KaraokeCaptionStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  words?: CaptionWord[];
  currentPlayheadMs?: number;
}

const DEFAULT_WORDS: CaptionWord[] = [
  { text: "Machine-First", startMs: 0, endMs: 400 },
  { text: "Design", startMs: 400, endMs: 700 },
  { text: "System", startMs: 700, endMs: 1100 },
  { text: "eliminates", startMs: 1100, endMs: 1500 },
  { text: "AI", startMs: 1500, endMs: 1800 },
  { text: "slop", startMs: 1800, endMs: 2200 },
];

export function KaraokeCaptionStream({
  words = DEFAULT_WORDS,
  currentPlayheadMs = 1200,
  className,
  ...props
}: KaraokeCaptionStreamProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 p-6 rounded-2xl border border-border bg-black/90 shadow-lg text-center",
        className
      )}
      role="region"
      aria-label="Synchronized Audio Caption Stream"
      {...props}
    >
      {words.map((word, idx) => {
        const isPast = currentPlayheadMs >= word.endMs;
        const isCurrent = currentPlayheadMs >= word.startMs && currentPlayheadMs < word.endMs;

        return (
          <span
            key={`${word.text}-${idx}`}
            className={cn(
              "text-lg md:text-2xl font-black tracking-tight transition-all duration-150",
              isCurrent && "text-primary scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]",
              isPast && "text-white opacity-90",
              !isPast && !isCurrent && "text-neutral-600 opacity-40"
            )}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}

```
