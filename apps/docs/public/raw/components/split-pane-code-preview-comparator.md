---
id: "split-pane-code-preview-comparator"
name: "Split Pane Code Preview Comparator"
category: "ui:ai-native"
library_origin: "https://github.com/aahil62/unslop"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "unslop"
  - "anti-slop"
  - "code-diff"
  - "comparator"
  - "ast-refactor"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Split Pane Code Preview Comparator (`split-pane-code-preview-comparator`)
> Side-by-side AST before/after unslop code comparator with health score deltas and instant copy action.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, layout-block, unslop, anti-slop, code-diff, comparator, ast-refactor
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add split-pane-code-preview-comparator

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/split-pane-code-preview-comparator.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Unslop & Anti-Slop (https://github.com/aahil62/unslop, https://github.com/dmmulroy/anti-slop)
 * @license MIT
 * @author Aahil & Dillon Mulroy
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Code2, ArrowRight, Sparkles, Check, Copy, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SplitPaneCodePreviewComparatorProps {
  beforeCode?: string;
  afterCode?: string;
  beforeScore?: number;
  afterScore?: number;
  fileName?: string;
  className?: string;
}

const DEFAULT_BEFORE_CODE = `// ❌ Generic Vibe-Coded AI Slop
export function HeroCard(props: any) {
  return (
    <div className="p-[17px] bg-gradient-to-r from-purple-500 to-blue-500 bg-white/10 backdrop-blur-md">
      <button className="bg-indigo-600 outline-none">
        Click Me 🚀
      </button>
    </div>
  );
}`;

const DEFAULT_AFTER_CODE = `// ✅ Zero-Slop 100/100 Remediated TSX
import { cn } from "@/lib/utils";
import { Rocket } from "lucide-react";

export interface HeroCardProps {
  className?: string;
}

export function HeroCard({ className }: HeroCardProps) {
  return (
    <div className={cn("p-4 rounded-xl border border-border bg-card shadow-xs", className)}>
      <button 
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>Get Started</span>
        <Rocket className="h-3.5 w-3.5" role="img" aria-hidden="true" />
      </button>
    </div>
  );
}`;

export function SplitPaneCodePreviewComparator({
  beforeCode = DEFAULT_BEFORE_CODE,
  afterCode = DEFAULT_AFTER_CODE,
  beforeScore = 35,
  afterScore = 100,
  fileName = "components/ui/hero-card.tsx",
  className,
}: SplitPaneCodePreviewComparatorProps) {
  const [copied, setCopied] = React.useState(false);

  const copyCleanCode = React.useCallback(async () => {
    await navigator.clipboard.writeText(afterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [afterCode]);

  return (
    <div className={cn("w-full space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs select-none", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" role="img" aria-hidden="true" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              AST Unslop Before/After Comparator
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {fileName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 font-mono text-destructive font-semibold">
              <AlertTriangle className="h-3 w-3" role="img" aria-hidden="true" /> {beforeScore}/100
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" role="img" aria-hidden="true" />
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3 w-3" role="img" aria-hidden="true" /> {afterScore}/100
            </span>
          </div>

          <button
            type="button"
            onClick={copyCleanCode}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" role="img" aria-hidden="true" /> Copied TSX
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" role="img" aria-hidden="true" /> Copy Clean Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* Before Pane */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-2xs text-destructive font-semibold px-1">
            <span>Before: Slop & Clichés</span>
            <span>High Flags Detected</span>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 overflow-x-auto text-muted-foreground whitespace-pre-wrap leading-relaxed h-[220px]">
            {beforeCode}
          </div>
        </div>

        {/* After Pane */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-2xs text-emerald-600 dark:text-emerald-400 font-semibold px-1">
            <span>After: AST Remediated</span>
            <span>100% WCAG AA Pass</span>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 overflow-x-auto text-foreground whitespace-pre-wrap leading-relaxed h-[220px]">
            {afterCode}
          </div>
        </div>
      </div>
    </div>
  );
}

```
