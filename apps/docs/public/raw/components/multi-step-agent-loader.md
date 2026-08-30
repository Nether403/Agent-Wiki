---
id: "multi-step-agent-loader"
name: "Multi-Step Agent Loader"
category: "ui:ai-native"
library_origin: "https://kokonutui.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "ai"
  - "loader"
  - "stepper"
  - "agent"
  - "kokonutui"
  - "aceternity"
  - "progress"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Multi-Step Agent Loader (`multi-step-agent-loader`)
> Stepped progression card for long-running AI workflows with live step verification states and latency timers.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, ai, loader, stepper, agent, kokonutui, aceternity, progress
- **Design Dials**: Variance 5/10 · Motion 4/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add multi-step-agent-loader

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/multi-step-agent-loader.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI & KokonutUI (https://ui.aceternity.com, https://kokonutui.com)
 * @author Aceternity / Kokonut & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { CheckCircle2, Circle, Loader2, AlertCircle, Clock } from "lucide-react";

export type AgentStepStatus = "pending" | "running" | "completed" | "error";

export interface AgentWorkflowStep {
  id: string;
  title: string;
  description?: string;
  status: AgentStepStatus;
  durationMs?: number;
}

export interface MultiStepAgentLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  steps?: AgentWorkflowStep[];
  onCancel?: () => void;
}

export function MultiStepAgentLoader({
  title = "Agent Workflow In Progress",
  steps = [
    { id: "1", title: "Ingesting Repository AST", description: "Parsing TSX files and AST dependency trees", status: "completed", durationMs: 340 },
    { id: "2", title: "Running Anti-Slop Audit", description: "Evaluating against 50 zero-slop AST rules", status: "completed", durationMs: 180 },
    { id: "3", title: "Compiling Tailwind v4 Tokens", description: "Resolving semantic design tokens and @theme block", status: "running", durationMs: 620 },
    { id: "4", title: "Axe-Core A11y Verification", description: "Ensuring 100% WCAG 2.1 AA compliance", status: "pending" },
    { id: "5", title: "Emitting Registry JSON Artifact", description: "Validating shadcn v3 registry schema", status: "pending" },
  ],
  onCancel,
  className,
  ...props
}: MultiStepAgentLoaderProps) {
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground flex flex-col gap-5",
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {/* Header with Title & Percentage */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shadow-xs">
            AI
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground leading-tight">{title}</h4>
            <p className="text-[11px] text-muted-foreground">
              {completedCount} of {steps.length} operations completed
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full w-full bg-primary origin-left transition-transform duration-300 rounded-full"
          style={{ transform: `scaleX(${progressPercent / 100})` }}
        />
      </div>

      {/* Step Sequence List */}
      <div className="flex flex-col gap-3">
        {steps.map((step, idx) => {
          const isRunning = step.status === "running";
          const isCompleted = step.status === "completed";
          const isError = step.status === "error";

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-xl border transition-all",
                isRunning
                  ? "border-primary/40 bg-primary/5 shadow-xs"
                  : isCompleted
                  ? "border-border/60 bg-muted/20"
                  : isError
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-transparent opacity-60"
              )}
            >
              {/* Step Icon Indicator */}
              <div className="mt-0.5 shrink-0">
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />}
                {isRunning && <Loader2 className="h-4 w-4 text-primary animate-spin" aria-hidden="true" />}
                {isError && <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />}
                {step.status === "pending" && <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
              </div>

              {/* Step Title & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold truncate",
                      isRunning ? "text-primary" : "text-foreground"
                    )}
                  >
                    {idx + 1}. {step.title}
                  </span>
                  {step.durationMs !== undefined && (
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                      {step.durationMs}ms
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Cancel Button */}
      {onCancel && (
        <div className="flex justify-end pt-2 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel Pipeline
          </button>
        </div>
      )}
    </div>
  );
}

```
