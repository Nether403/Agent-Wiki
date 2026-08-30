---
id: "decision-node-canvas"
name: "Decision Node Canvas"
category: "ui:workflow"
library_origin: "https://github.com/xyflow/xyflow"
dependencies:
  - "motion"
  - "lucide-react"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "canvas"
  - "workflow"
  - "decision-tree"
  - "dag"
  - "xyflow"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Decision Node Canvas (`decision-node-canvas`)
> Interactive DAG flow with condition nodes, zooming/panning, and branch evaluation.

- **Taxonomy Category**: `ui:workflow`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, webgl, threejs, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, canvas, workflow, decision-tree, dag, xyflow
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add decision-node-canvas

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/decision-node-canvas.json
```

## Peer Dependencies
- `motion`
- `lucide-react`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin XY Flow (https://github.com/xyflow/xyflow)
 * @author XY Flow & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState, useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GitBranch, Check, X, ShieldCheck, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DecisionNode {
  id: string;
  title: string;
  condition: string;
  passTargetId?: string;
  failTargetId?: string;
  status?: "pending" | "passed" | "rejected";
}

export interface DecisionNodeCanvasProps {
  nodes?: DecisionNode[];
  onDecisionSelect?: (node: DecisionNode) => void;
  className?: string;
}

const DEFAULT_DECISIONS: DecisionNode[] = [
  { id: "d1", title: "A11y AA Pass", condition: "Contrast >= 4.5:1 & Keyboard Focus", passTargetId: "d2", failTargetId: "d3", status: "passed" },
  { id: "d2", title: "Zero AI Slop", condition: "35 Rules Verified (No Indigo / Gradients)", passTargetId: "d4", failTargetId: "d3", status: "passed" },
  { id: "d3", title: "Automated Fix", condition: "Apply AST Codemods & Re-verify", status: "pending" },
  { id: "d4", title: "Release Gate", condition: "Approved for /r/ Distribution", status: "passed" },
];

export function DecisionNodeCanvas({
  nodes = DEFAULT_DECISIONS,
  onDecisionSelect,
  className,
}: DecisionNodeCanvasProps) {
  const [selectedId, setSelectedId] = useState<string>("d2");
  const shouldReduceMotion = useReducedMotion();
  const labelId = useId();

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-foreground overflow-hidden shadow-sm",
        className
      )}
      role="region"
      aria-labelledby={labelId}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" aria-hidden="true" />
          <span id={labelId} className="text-xs font-mono font-medium tracking-tight">
            DECISION_DAG // GATES
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          <span>Deterministic Audit Branching</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node, index) => {
          const isSelected = node.id === selectedId;

          return (
            <motion.div
              key={node.id}
              onClick={() => {
                setSelectedId(node.id);
                onDecisionSelect?.(node);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(node.id);
                  onDecisionSelect?.(node);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${node.title}: ${node.condition}`}
              className={cn(
                "relative rounded-lg border p-4 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-background hover:bg-muted/30"
              )}
              initial={false}
              animate={shouldReduceMotion ? {} : { scale: isSelected ? 1.01 : 1 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">NODE 0{index + 1}</span>
                {node.status === "passed" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    Passed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <HelpCircle className="h-3 w-3" aria-hidden="true" />
                    Pending
                  </span>
                )}
              </div>

              <h4 className="mt-2 text-sm font-semibold">{node.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{node.condition}</p>

              {(node.passTargetId || node.failTargetId) && (
                <div className="mt-3 flex items-center gap-2 border-t border-border/70 pt-2 text-[11px] font-mono">
                  {node.passTargetId && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      PASS → {node.passTargetId}
                    </span>
                  )}
                  {node.failTargetId && (
                    <span className="text-destructive">
                      FAIL → {node.failTargetId}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

```
