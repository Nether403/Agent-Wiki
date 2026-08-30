---
id: "integration-grid-showcase"
name: "Integration Grid Showcase"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
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

# Integration Grid Showcase (`integration-grid-showcase`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add integration-grid-showcase

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/integration-grid-showcase.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Bot, Terminal, Cpu, Sparkles, Box, Code2, Globe } from "lucide-react";

export interface IntegrationPartner {
  name: string;
  category: "Coding Agent" | "IDE" | "Protocol";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface IntegrationGridShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  partners?: IntegrationPartner[];
}

const DEFAULT_PARTNERS: IntegrationPartner[] = [
  { name: "Claude Code", category: "Coding Agent", description: "Native project & user scope MCP bindings with auto-reload", icon: Terminal },
  { name: "Cursor IDE", category: "IDE", description: "Zero-latency .cursorrules + MDC rules synchronization", icon: Code2 },
  { name: "Windsurf", category: "IDE", description: "Cascade AI integration with .windsurfrules token awareness", icon: Globe },
  { name: "Hermes CLI", category: "Coding Agent", description: "Deep-execution terminal agent with Tripwire safety", icon: Bot },
  { name: "OpenClaw", category: "Coding Agent", description: "Autonomous full-stack workflow runner", icon: Cpu },
  { name: "GitHub Copilot", category: "IDE", description: "Copilot instruction synchronization via repository rules", icon: Sparkles },
];

export function IntegrationGridShowcase({
  title = "Universal Agent & IDE Ecosystem Integration",
  partners = DEFAULT_PARTNERS,
  className,
  ...props
}: IntegrationGridShowcaseProps) {
  return (
    <section
      className={cn(
        "flex flex-col w-full p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6 text-card-foreground",
        className
      )}
      aria-label={title}
      {...props}
    >
      <header className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">
          Synchronized across 11 AI platforms with 100% token compliance and verified rulepacks.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {partners.map((p) => {
          const Icon = p.icon;
          return (
            <article
              key={p.name}
              className="flex flex-col p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {p.category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground">{p.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

```
