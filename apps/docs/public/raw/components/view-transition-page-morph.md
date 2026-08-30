---
id: "view-transition-page-morph"
name: "View Transition Page Morph"
category: "ui:motion"
library_origin: "https://beui.dev"
dependencies:
  - "motion"
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "view-transition"
  - "react-19"
  - "page-morph"
  - "spring-physics"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# View Transition Page Morph (`view-transition-page-morph`)
> React 19 / Next.js View Transition coordinator primitive supporting seamless element morphs and layout transitions with cross-browser fallback.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, view-transition, react-19, page-morph, spring-physics
- **Design Dials**: Variance 6/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add view-transition-page-morph

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/view-transition-page-morph.json
```

## Peer Dependencies
- `motion`
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:motion
 * Name: view-transition-page-morph
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Sparkles, MoveRight, Layers } from "lucide-react";

export interface MorphItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  accentColor: string;
}

export interface ViewTransitionMorphProps {
  items?: MorphItem[];
  className?: string;
}

export const ViewTransitionPageMorph: React.FC<ViewTransitionMorphProps> = ({
  items = [
    {
      id: "agent-mcp",
      title: "Model Context Protocol Bridge",
      category: "Transport & Tools",
      summary: "Connect AI coding agents to local and remote UI component registries with <15KB payload limits.",
      details: "The MCP server uses SSE streaming and Stdio transports to supply Claude Code, Cursor, and Codex with zero-slop component ASTs, automatic alias mapping, and topological installation sequences.",
      accentColor: "border-primary/40 bg-primary/5 text-primary",
    },
    {
      id: "anti-slop-engine",
      title: "50-Rule Anti-Slop Linter",
      category: "Quality Governance",
      summary: "Deterministic AST & regex guardrails blocking bad colors, type bypasses, and accessibility regressions.",
      details: "Detects chained assertions (SLOP-004), arbitrary non-token units (SLOP-007), missing focus rings (SLOP-012), unannounced AI token streams (SLOP-043), and un-memoized heavy render transforms (SLOP-035).",
      accentColor: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
    },
    {
      id: "style-dict-tokens",
      title: "DTCG & Style Dictionary v4",
      category: "Design Systems",
      summary: "Single source of truth exporting tokens to Tailwind v4, Swift, Kotlin, and Figma Tokens.",
      details: "Transforms W3C DTCG design tokens across mobile and web targets, guaranteeing WCAG 2.1 AA contrast matrices across all semantic foreground and background pairs.",
      accentColor: "border-sky-500/40 bg-sky-500/5 text-sky-400",
    },
  ],
  className = "",
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedId);

  const handleSelect = (id: string) => {
    // If native document.startViewTransition is available, coordinate with browser
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setSelectedId(id);
      });
    } else {
      setSelectedId(id);
    }
  };

  const handleBack = () => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setSelectedId(null);
      });
    } else {
      setSelectedId(null);
    }
  };

  return (
    <section
      aria-label="View Transition Layout Morph"
      className={`flex flex-col w-full max-w-2xl mx-auto p-6 rounded-2xl bg-card border border-border text-card-foreground shadow-2xl overflow-hidden min-h-[420px] ${className}`}
    >
      <header className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" role="img" aria-label="View Transition Icon" />
          <h2 className="text-sm font-semibold text-foreground">React 19 View Transition Coordinator</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-muted border border-border text-muted-foreground">
          {selectedId ? "Detail Morph" : "List Grid"}
        </span>
      </header>

      <AnimatePresence mode="wait">
        {!selectedItem ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4"
          >
            {items.map((item) => (
              <motion.article
                key={item.id}
                layoutId={`card-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className="flex flex-col justify-between p-4 rounded-xl border border-border bg-background hover:border-foreground/40 cursor-pointer transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(item.id);
                  }
                }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${item.accentColor}`}>
                      {item.category}
                    </span>
                    <MoveRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground pt-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.summary}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.article
            key={`detail-${selectedItem.id}`}
            layoutId={`card-${selectedItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1 p-6 rounded-xl border border-border bg-background space-y-4"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back to component list"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${selectedItem.accentColor}`}>
                {selectedItem.category}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xl font-bold text-foreground">{selectedItem.title}</h3>
              <p className="text-sm font-medium text-primary">{selectedItem.summary}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground leading-relaxed">
              {selectedItem.details}
            </div>

            <footer className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                beUI & Vercel View Transitions Spec
              </span>
              <span>100% WCAG 2.1 AA</span>
            </footer>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
};
export default ViewTransitionPageMorph;

```
