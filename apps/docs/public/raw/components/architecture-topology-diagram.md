---
id: "architecture-topology-diagram"
name: "Architecture Topology Diagram"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Architecture Topology Diagram (`architecture-topology-diagram`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add architecture-topology-diagram

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/architecture-topology-diagram.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Server, Database, Globe, Shield, Cpu } from "lucide-react";

export interface TopologyNode {
  id: string;
  label: string;
  type: "client" | "gateway" | "service" | "database";
  status?: "healthy" | "degraded" | "standby";
}

export interface ArchitectureTopologyDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  nodes?: TopologyNode[];
}

export function ArchitectureTopologyDiagram({
  title = "Cloud Infrastructure & Topology Map",
  className,
  ...props
}: ArchitectureTopologyDiagramProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Architecture Topology Diagram: ${title}`}
      {...props}
    >
      <header className="flex items-center justify-between border-b border-border pb-3 mb-6">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Zero-dependency analytical SVG topology showing service ingress, execution, and data tiers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Live Telemetry
          </span>
        </div>
      </header>

      {/* SVG Topology Flow */}
      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 740 220"
          className="w-full sm:min-w-[680px] min-w-full h-auto overflow-visible"
          role="img"
          aria-label="Multi-tier microservices architecture topology"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" className="text-muted-foreground/60" />
            </marker>
          </defs>

          {/* Connectors / Paths */}
          <path
            d="M 120 110 L 220 110"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#arrow)"
            className="text-muted-foreground/50"
          />
          <path
            d="M 340 110 C 390 110, 390 60, 440 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
            className="text-muted-foreground/50"
          />
          <path
            d="M 340 110 C 390 110, 390 160, 440 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
            className="text-muted-foreground/50"
          />
          <path
            d="M 560 60 C 600 60, 600 110, 640 110"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
            className="text-muted-foreground/50"
          />
          <path
            d="M 560 160 C 600 160, 600 110, 640 110"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
            className="text-muted-foreground/50"
          />

          {/* Tier 1: Client Edge */}
          <g transform="translate(10, 75)">
            <rect
              width="110"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-muted/30 stroke-border stroke-1"
            />
            <text x="55" y="32" textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              Global CDN
            </text>
            <text x="55" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Edge Proxies
            </text>
          </g>

          {/* Tier 2: API Gateway */}
          <g transform="translate(220, 75)">
            <rect
              width="120"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-primary/10 stroke-primary/40 stroke-1"
            />
            <text x="60" y="32" textAnchor="middle" className="fill-primary text-[11px] font-bold">
              API Gateway
            </text>
            <text x="60" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Auth & Routing
            </text>
          </g>

          {/* Tier 3A: Compute Cluster */}
          <g transform="translate(440, 25)">
            <rect
              width="120"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-muted/30 stroke-border stroke-1"
            />
            <text x="60" y="32" textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              Agent Runtime
            </text>
            <text x="60" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Worker Pool
            </text>
          </g>

          {/* Tier 3B: MCP Registry */}
          <g transform="translate(440, 125)">
            <rect
              width="120"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-muted/30 stroke-border stroke-1"
            />
            <text x="60" y="32" textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              MCP Gateway
            </text>
            <text x="60" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              JSON-RPC / SSE
            </text>
          </g>

          {/* Tier 4: Database Lakehouse */}
          <g transform="translate(640, 75)">
            <rect
              width="90"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-muted/30 stroke-border stroke-1"
            />
            <text x="45" y="32" textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              PostgreSQL
            </text>
            <text x="45" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              State & Vectors
            </text>
          </g>
        </svg>
      </div>

      <footer className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-primary/40" aria-hidden="true" />
            Security Perimeter
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-muted border border-border" aria-hidden="true" />
            Execution Pods
          </span>
        </div>
        <span className="font-mono text-[11px]">Latency: 12ms avg</span>
      </footer>
    </figure>
  );
}

```
