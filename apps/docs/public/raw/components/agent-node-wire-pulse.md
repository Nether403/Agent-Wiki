---
id: "agent-node-wire-pulse"
name: "Agent Node Wire Pulse"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Agent Node Wire Pulse (`agent-node-wire-pulse`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add agent-node-wire-pulse

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/agent-node-wire-pulse.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin XY Flow & Magic UI (https://xyflow.com / https://magicui.design)
 * @author XY Flow & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface AgentNodeWirePulseProps extends React.SVGProps<SVGSVGElement> {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  curvature?: number;
  pulseColor?: string;
  duration?: number;
}

export function AgentNodeWirePulse({
  startX = 50,
  startY = 50,
  endX = 250,
  endY = 150,
  curvature = 0.5,
  pulseColor = "currentColor",
  duration = 2.5,
  className,
  ...props
}: AgentNodeWirePulseProps) {
  const pathId = React.useId();

  // Compute cubic bezier control points
  const dx = endX - startX;
  const dy = endY - startY;
  const cp1x = startX + dx * curvature;
  const cp1y = startY;
  const cp2x = endX - dx * curvature;
  const cp2y = endY;

  const pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

  return (
    <svg
      className={cn("pointer-events-none overflow-visible w-full h-full", className)}
      role="img"
      aria-label="Workflow node wire with animated data pulse"
      {...props}
    >
      <defs>
        <linearGradient id={`${pathId}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base Connector Wire */}
      <path
        d={pathData}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-border transition-colors duration-200"
      />

      {/* Animated Pulse Beam along wire */}
      <path
        d={pathData}
        fill="none"
        stroke={`url(#${pathId}-gradient)`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 120"
        className="animate-wire-pulse"
        style={{
          animationDuration: `${duration}s`,
        }}
      />

      {/* Connection Endpoint Anchors */}
      <circle cx={startX} cy={startY} r="3" className="fill-primary" />
      <circle cx={endX} cy={endY} r="3" className="fill-primary" />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes wire-pulse {
            from {
              stroke-dashoffset: 160;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .animate-wire-pulse {
            animation: wire-pulse 2.5s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-wire-pulse {
              animation: none !important;
              stroke-dasharray: none !important;
              opacity: 0.5;
            }
          }
        `,
      }} />
    </svg>
  );
}

```
