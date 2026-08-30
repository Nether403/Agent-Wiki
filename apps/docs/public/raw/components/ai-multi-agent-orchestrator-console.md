---
id: "ai-multi-agent-orchestrator-console"
name: "A I Multi Agent Orchestrator Console"
category: "ui:ai-native"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "ai-native"
  - "agent-ui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# A I Multi Agent Orchestrator Console (`ai-multi-agent-orchestrator-console`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, ai-native, agent-ui
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-multi-agent-orchestrator-console

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-multi-agent-orchestrator-console.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { Terminal, Users, Bot, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export interface AgentPeer {
  id: string;
  name: string;
  role: string;
  status: "idle" | "thinking" | "executing";
  currentTask?: string;
  turnsCompleted: number;
}

export interface AIMultiAgentOrchestratorConsoleProps {
  agents?: AgentPeer[];
  className?: string;
}

export function AIMultiAgentOrchestratorConsole({
  agents = [
    { id: "planner", name: "Architect Agent", role: "Supervisory Planner", status: "idle", currentTask: "Awaiting QA report", turnsCompleted: 4 },
    { id: "coder", name: "Code Engineer", role: "Implementation", status: "executing", currentTask: "Injecting screened components", turnsCompleted: 12 },
    { id: "auditor", name: "Security Auditor", role: "Tripwire Gate", status: "idle", currentTask: "AST verified clean", turnsCompleted: 3 },
    { id: "qa", name: "A11y Reviewer", role: "WCAG AA Checker", status: "thinking", currentTask: "Calculating luminance ratio", turnsCompleted: 6 },
  ],
  className = "",
}: AIMultiAgentOrchestratorConsoleProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("coder");

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm " + className}>
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="w-4 h-4" role="img" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Multi-Agent Swarm Orchestrator</h3>
            <span className="text-xs text-muted-foreground font-mono">4 Subagents Active • Distributed Worktree</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
          <ShieldCheck className="w-3.5 h-3.5" role="img" aria-hidden="true" />
          Sandbox Active
        </span>
      </div>

      {/* Agent Roster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={
                "p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between " +
                (isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background/50 hover:bg-muted/30")
              }
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono text-muted-foreground">{agent.role}</span>
                  <span
                    className={
                      "w-2 h-2 rounded-full " +
                      (agent.status === "executing"
                        ? "bg-primary animate-ping"
                        : agent.status === "thinking"
                        ? "bg-amber-400"
                        : "bg-muted-foreground")
                    }
                    aria-hidden="true"
                  />
                </div>
                <h4 className="text-sm font-medium text-foreground">{agent.name}</h4>
              </div>
              <div className="mt-3 pt-2 border-t border-border/50 text-xs font-mono text-muted-foreground flex justify-between">
                <span>Turns</span>
                <span>{agent.turnsCompleted}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Inspector Terminal */}
      {selectedAgent && (
        <div className="p-4 rounded-lg bg-background border border-border font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-primary" role="img" aria-hidden="true" />
              AGENT TELEMETRY // {selectedAgent.id.toUpperCase()}
            </span>
            <span>Status: {selectedAgent.status.toUpperCase()}</span>
          </div>
          <p className="text-foreground">Current Task: {selectedAgent.currentTask || "Idle"}</p>
        </div>
      )}
    </div>
  );
}

```
