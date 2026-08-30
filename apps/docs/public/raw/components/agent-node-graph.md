---
id: "agent-node-graph"
name: "Agent Node Graph"
category: "ui:workflow"
library_origin: "https://github.com/xyflow/xyflow"
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
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "spring-physics"
  - "workflow"
  - "canvas"
  - "agent"
  - "xyflow"
  - "dag"
  - "interactive"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Agent Node Graph (`agent-node-graph`)
> Dynamic visual canvas representing multi-agent orchestration, pipeline steps, and tool executions.

- **Taxonomy Category**: `ui:workflow`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, spring-physics, workflow, canvas, agent, xyflow, dag, interactive
- **Design Dials**: Variance 6/10 · Motion 5/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add agent-node-graph

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/agent-node-graph.json
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
 * @origin XY Flow (https://github.com/xyflow/xyflow)
 * @author XY Flow Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, RefreshCw, Layers, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "completed" | "failed";
  x: number;
  y: number;
  connections: string[];
}

export interface AgentNodeGraphProps {
  nodes?: AgentNode[];
  onNodeSelect?: (node: AgentNode) => void;
  className?: string;
}

const DEFAULT_NODES: AgentNode[] = [
  { id: "planner", name: "Planner Agent", role: "Decomposes goals into tasks", status: "completed", x: 60, y: 120, connections: ["researcher", "coder"] },
  { id: "researcher", name: "Research Agent", role: "Fetches docs & verifies APIs", status: "completed", x: 300, y: 60, connections: ["evaluator"] },
  { id: "coder", name: "Coder Agent", role: "Writes zero-slop TSX implementations", status: "running", x: 300, y: 200, connections: ["evaluator"] },
  { id: "evaluator", name: "Quality Gate", role: "Runs automated a11y & anti-slop checks", status: "idle", x: 560, y: 130, connections: [] },
];

export function AgentNodeGraph({
  nodes = DEFAULT_NODES,
  onNodeSelect,
  className,
}: AgentNodeGraphProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>("coder");
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  const handleSelect = useCallback(
    (node: AgentNode) => {
      setActiveNodeId(node.id);
      onNodeSelect?.(node);
    },
    [onNodeSelect]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === activeNodeId) || nodes[0],
    [nodes, activeNodeId]
  );

  return (
    <div
      className={cn(
        "relative flex flex-col w-full overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm",
        className
      )}
      role="region"
      aria-label="Agent Orchestration Node Graph"
    >
      {/* Graph Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-mono font-medium tracking-tight">AGENT // NODE_TOPOLOGY_v1</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            aria-label={isRunning ? "Pause agent pipeline" : "Resume agent pipeline"}
            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isRunning ? (
              <>
                <Pause className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Resume</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveNodeId("planner")}
            aria-label="Reset agent node view"
            className="rounded-md border border-border bg-background p-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Interactive Spatial Canvas Viewport */}
      <div className="relative h-80 w-full overflow-hidden bg-background">
        {/* Subtle coordinate dot grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />

        {/* SVG Connection Edges */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true">
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;
              const startX = node.x + 130;
              const startY = node.y + 36;
              const endX = target.x;
              const endY = target.y + 36;
              const midX = (startX + endX) / 2;

              return (
                <path
                  key={`${node.id}-${target.id}`}
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border"
                />
              );
            })
          )}
        </svg>

        {/* Interactive Node Cards */}
        {nodes.map((node) => {
          const isSelected = node.id === activeNodeId;
          const statusIcon =
            node.status === "completed" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            ) : node.status === "running" ? (
              <Clock className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            );

          return (
            <motion.div
              key={node.id}
              onClick={() => handleSelect(node)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(node);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${node.name} (${node.status})`}
              className={cn(
                "absolute cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground"
              )}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: "150px",
              }}
              initial={false}
              animate={shouldReduceMotion ? {} : { scale: isSelected ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{node.name}</span>
                {statusIcon}
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1">{node.role}</p>
              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-1 text-[10px] font-mono text-muted-foreground">
                <span>STATUS</span>
                <span className="uppercase">{node.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Node Details Inspection Footer */}
      {selectedNode && (
        <div className="border-t border-border bg-muted/20 px-4 py-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-muted-foreground">INSPECTING: {selectedNode.id}</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
              {selectedNode.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium">{selectedNode.role}</p>
        </div>
      )}
    </div>
  );
}

```
