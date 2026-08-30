---
id: "customer-story-masonry"
name: "Customer Story Masonry"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Customer Story Masonry (`customer-story-masonry`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add customer-story-masonry

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/customer-story-masonry.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Quote, Sparkles, Star } from "lucide-react";

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  metric?: string;
}

export interface CustomerStoryMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  stories?: TestimonialItem[];
}

const DEFAULT_STORIES: TestimonialItem[] = [
  {
    id: "1",
    quote: "With 30 Anti-Slop Rules enforcing Tailwind v4 and strict contrast, our Claude Code pipelines generate production PRs that require zero human cleanup.",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "Veloce Cloud",
    metric: "0 AI Slop Violations",
  },
  {
    id: "2",
    quote: "The 15KB context limit was a game changer for our Hermes and Cursor agents. No more context blowing up midway through refactoring.",
    author: "Marcus Vance",
    role: "Staff AI Engineer",
    company: "Synthetix Labs",
    metric: "85% Token Savings",
  },
  {
    id: "3",
    quote: "Cathryn Lavery's 39 diagram blueprints rendered as pure, lightweight SVGs made our architecture docs look like a high-end design agency built them.",
    author: "Sara Lin",
    role: "Principal Architect",
    company: "Komorebi Dynamics",
    metric: "39 SVG Blueprints",
  },
];

export function CustomerStoryMasonry({
  title = "Trusted by Autonomous Development Teams",
  stories = DEFAULT_STORIES,
  className,
  ...props
}: CustomerStoryMasonryProps) {
  return (
    <section
      className={cn(
        "flex flex-col w-full p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-card-foreground",
        className
      )}
      aria-label={title}
      {...props}
    >
      <header className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">
          Real telemetry and qualitative feedback from engineers using the Machine-First Design System.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stories.map((s) => (
          <article
            key={s.id}
            className="flex flex-col justify-between p-5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <Quote className="h-5 w-5 text-primary/60" aria-hidden="true" />
              <p className="text-xs text-foreground/90 leading-relaxed italic">
                "{s.quote}"
              </p>
            </div>

            <footer className="pt-3 border-t border-border/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">{s.author}</h4>
                <p className="text-[10px] text-muted-foreground">
                  {s.role} · {s.company}
                </p>
              </div>

              {s.metric && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  {s.metric}
                </span>
              )}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

```
