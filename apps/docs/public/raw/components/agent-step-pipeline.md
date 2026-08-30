---
id: "agent-step-pipeline"
name: "Agent Step Pipeline"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
  - "motion"
tags:
  - "lucide-react"
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

# Agent Step Pipeline (`agent-step-pipeline`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add agent-step-pipeline

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/agent-step-pipeline.json
```

## Peer Dependencies
- `lucide-react`
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
import { CheckCircle2, Clock, Terminal, AlertTriangle, ArrowRight, Bot, Cpu } from "lucide-react";

export interface PipelineStep {
  id: string;
  agentRole: string;
  toolCall: string;
  durationMs: number;
  tokensUsed: number;
  status: "success" | "running" | "error" | "pending";
  outputSummary?: string;
}

export interface AgentStepPipelineProps extends React.HTMLAttributes<HTMLDivElement> {
  sessionTitle?: string;
  steps?: PipelineStep[];
}

const DEFAULT_STEPS: PipelineStep[] = [
  { id: "1", agentRole: "Architect", toolCall: "search_library({ query: 'dock' })", durationMs: 140, tokensUsed: 120, status: "success", outputSummary: "Discovered floating-dock with variance 6, motion 7" },
  { id: "2", agentRole: "Security Sandbox", toolCall: "scanMaliciousPayload(source)", durationMs: 45, tokensUsed: 40, status: "success", outputSummary: "Clean AST payload (0 dangerous sink patterns)" },
  { id: "3", agentRole: "Anti-Slop Linter", toolCall: "audit_code_slop(source)", durationMs: 310, tokensUsed: 180, status: "success", outputSummary: "Verified 30 rules (Score: 100/100, 0 violations)" },
  { id: "4", agentRole: "Builder", toolCall: "get_installation_schema('floating-dock')", durationMs: 520, tokensUsed: 410, status: "success", outputSummary: "Installed floating-dock.tsx into components/ui/" },
];

export function AgentStepPipeline({
  sessionTitle = "Subagent Execution DAG Pipeline",
  steps = DEFAULT_STEPS,
  className,
  ...props
}: AgentStepPipelineProps) {
  const totalDuration = steps.reduce((sum, s) => sum + s.durationMs, 0);
  const totalTokens = steps.reduce((sum, s) => sum + s.tokensUsed, 0);

  return (
    <section
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6 text-card-foreground",
        className
      )}
      aria-label={`Agent Step Pipeline: ${sessionTitle}`}
      {...props}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{sessionTitle}</h3>
            <p className="text-xs text-muted-foreground">Autonomous multi-agent verification trajectory</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted border border-border">
            ⏱️ {totalDuration}ms
          </span>
          <span className="px-2 py-1 rounded-md bg-muted border border-border">
            🪙 {totalTokens} tokens
          </span>
        </div>
      </header>

      {/* Step Pipeline List */}
      <div className="flex flex-col space-y-4">
        {steps.map((step, idx) => (
          <article
            key={step.id}
            className="flex flex-col p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-foreground">{step.agentRole}</span>
                <span className="text-muted-foreground text-xs">•</span>
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {step.toolCall}
                </code>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {step.status === "success" && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Passed
                  </span>
                )}
                {step.status === "running" && (
                  <span className="flex items-center gap-1 text-primary font-semibold text-[11px] animate-pulse">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Running
                  </span>
                )}
                {step.status === "error" && (
                  <span className="flex items-center gap-1 text-destructive font-semibold text-[11px]">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    Failed
                  </span>
                )}
              </div>
            </div>

            {step.outputSummary && (
              <p className="text-xs text-muted-foreground pl-7 leading-relaxed">
                {step.outputSummary}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

```
