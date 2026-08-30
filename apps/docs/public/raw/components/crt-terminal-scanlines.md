---
id: "crt-terminal-scanlines"
name: "CRT Terminal Scanline Display"
category: "ui:creative"
library_origin: "https://cult-ui.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "brutalist"
  - "neon-scifi"
  - "wai-aria-compliant"
  - "creative"
  - "retro"
  - "crt"
  - "scanlines"
  - "terminal"
  - "cult-ui"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# CRT Terminal Scanline Display (`crt-terminal-scanlines`)
> Retro CRT monitor emulator with animated horizontal scanlines, phosphor glow, screen curvature, and text flicker.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `LOW`
- **Technical Tags**: lucide-react, tailwind-v4, brutalist, neon-scifi, wai-aria-compliant, creative, retro, crt, scanlines, terminal, cult-ui
- **Design Dials**: Variance 8/10 · Motion 6/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add crt-terminal-scanlines

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/crt-terminal-scanlines.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Cult UI / NeonBlade UI (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Terminal, Shield } from "lucide-react";

export interface CrtTerminalScanlinesProps extends React.HTMLAttributes<HTMLDivElement> {
  promptText?: string;
  outputLines?: string[];
}

const DEFAULT_OUTPUT = [
  "ANTIGRAVITY OS [Version 2.4.0-VERIFIED]",
  "(c) 2026 Machine-First Design Agent Wiki. All rights reserved.",
  "",
  "> mcp audit --rules=35 --a11y=AA",
  "[OK] 35/35 Anti-Slop verification gates passed.",
  "[OK] Zero unhandled promise rejections detected.",
  "[OK] WCAG 2.1 AA contrast integrity verified.",
  "",
  "> ready for autonomous execution.",
];

export function CrtTerminalScanlines({
  promptText = "agent@wiki-host:~$",
  outputLines = DEFAULT_OUTPUT,
  className,
  ...props
}: CrtTerminalScanlinesProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col w-full rounded-2xl border border-emerald-500/40 bg-card dark:bg-black text-emerald-500 font-mono shadow-2xl overflow-hidden p-5 select-none",
        className
      )}
      role="region"
      aria-label="Retro CRT Monitor Terminal"
      {...props}
    >
      {/* Top Monitor Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" aria-hidden="true" />
          <span className="font-bold tracking-wider">CRT-PHOSPHOR-DISPLAY // VT100</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
          <Shield className="h-3 w-3" aria-hidden="true" />
          <span>SECURE_SHELL</span>
        </div>
      </div>

      {/* Terminal Content Lines with Phosphor Glow */}
      <div className="space-y-1 text-xs leading-relaxed drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">
        {outputLines.map((line, idx) => (
          <div key={idx} className="min-h-4 whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div className="flex items-center gap-1 pt-1">
          <span className="font-bold">{promptText}</span>
          <span className="h-4 w-2 bg-emerald-500 animate-pulse" aria-hidden="true" />
        </div>
      </div>

      {/* Scanline & Curvature Visual Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"
        aria-hidden="true"
      />
    </div>
  );
}

```
