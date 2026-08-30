---
id: "interactive-feature-cycler"
name: "Interactive Feature Cycler"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Interactive Feature Cycler (`interactive-feature-cycler`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add interactive-feature-cycler

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/interactive-feature-cycler.json
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
import { ShieldCheck, Cpu, Code2, Sparkles } from "lucide-react";

export interface CyclerFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  graphic: React.ReactNode;
}

export interface InteractiveFeatureCyclerProps extends React.HTMLAttributes<HTMLDivElement> {
  features?: CyclerFeature[];
  autoCycleIntervalMs?: number;
}

const DEFAULT_FEATURES: CyclerFeature[] = [
  {
    id: "f1",
    title: "15KB Machine-Readable Context",
    description: "Compact YAML and JSON endpoints prevent agent context flooding during heavy refactoring sessions.",
    icon: Cpu,
    graphic: (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
        <Cpu className="h-12 w-12 text-primary" aria-hidden="true" />
        <span className="text-xs font-mono font-bold text-foreground">ENFORCE_TOKEN_BUDGET(15KB)</span>
      </div>
    ),
  },
  {
    id: "f2",
    title: "30 Anti-Slop Safeguards",
    description: "Automated AST linting blocks arbitrary pixel units, unshaded white/black backgrounds, and chained casts.",
    icon: ShieldCheck,
    graphic: (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
        <ShieldCheck className="h-12 w-12 text-emerald-500" aria-hidden="true" />
        <span className="text-xs font-mono font-bold text-foreground">AST_HEALTH_SCORE: 100/100</span>
      </div>
    ),
  },
  {
    id: "f3",
    title: "Automated Unslop Retheming",
    description: "Convert generic vibe-coded components into high-fidelity Neo-Tokyo, Midnight, or Minimal design languages.",
    icon: Code2,
    graphic: (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
        <Code2 className="h-12 w-12 text-primary" aria-hidden="true" />
        <span className="text-xs font-mono font-bold text-foreground">UNSLOP --theme neo-tokyo</span>
      </div>
    ),
  },
];

export function InteractiveFeatureCycler({
  features = DEFAULT_FEATURES,
  autoCycleIntervalMs = 5000,
  className,
  ...props
}: InteractiveFeatureCyclerProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, autoCycleIntervalMs);

    return () => clearInterval(timer);
  }, [features.length, autoCycleIntervalMs]);

  const activeFeature = features[activeIdx];

  return (
    <section
      className={cn(
        "flex flex-col md:flex-row gap-8 items-center p-8 rounded-2xl border border-border bg-card shadow-sm text-card-foreground",
        className
      )}
      aria-label="Interactive Feature Cycler"
      {...props}
    >
      {/* Features Tab Buttons */}
      <div className="flex flex-col space-y-3 w-full md:w-1/2">
        {features.map((f, idx) => {
          const isActive = idx === activeIdx;
          const Icon = f.icon;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border text-left transition-all relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary/50 bg-primary/5 shadow-xs"
                  : "border-transparent hover:bg-muted/40"
              )}
              aria-selected={isActive}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-lg shrink-0 text-xs font-bold",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex flex-col flex-1">
                <h4 className="text-xs font-bold text-foreground">{f.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {f.description}
                </p>
              </div>

              {/* Progress bar line for active item */}
              {isActive && (
                <div
                  style={{ animationDuration: `${autoCycleIntervalMs}ms` }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-pulse"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Graphic Screen Display */}
      <div className="w-full md:w-1/2 min-h-[260px] rounded-xl border border-border bg-muted/20 flex items-center justify-center p-6 shadow-inner">
        {activeFeature.graphic}
      </div>
    </section>
  );
}

```
