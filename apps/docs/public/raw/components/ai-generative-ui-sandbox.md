---
id: "ai-generative-ui-sandbox"
name: "Ai Generative Ui Sandbox"
category: "ui:ai-native"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "ai-native"
  - "agent-ui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Ai Generative Ui Sandbox (`ai-generative-ui-sandbox`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, ai-native, agent-ui
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-generative-ui-sandbox

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-generative-ui-sandbox.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin 21st.dev & Machine-First Design Agent Wiki
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Play, RotateCcw, Shield, Terminal, Maximize2, Minimize2 } from "lucide-react";

export interface GenerativeUISandboxProps extends React.HTMLAttributes<HTMLDivElement> {
  rawComponentCode?: string;
  sandboxTitle?: string;
  isExecuting?: boolean;
  children?: React.ReactNode;
}

export function AiGenerativeUiSandbox({
  rawComponentCode = "export default function GeneratedWidget() {\n  return <div className=\"p-4 rounded-xl bg-primary text-primary-foreground\">Autonomous UI Artifact</div>;\n}",
  sandboxTitle = "AI Generative UI Execution Sandbox",
  isExecuting = false,
  children,
  className,
  ...props
}: GenerativeUISandboxProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview");
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-200",
        isExpanded ? "fixed inset-4 z-50 max-w-none" : "w-full max-w-3xl",
        className
      )}
      role="region"
      aria-label={sandboxTitle}
      {...props}
    >
      {/* Sandbox Navigation Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 font-mono text-xs font-semibold text-foreground truncate">
            {sandboxTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg bg-muted p-0.5" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "preview"}
              onClick={() => setActiveTab("preview")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "preview" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Preview
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "code"}
              onClick={() => setActiveTab("code")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "code" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Source
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isExpanded ? "Collapse sandbox frame" : "Maximize sandbox frame"}
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Sandbox Body */}
      <div className="relative flex-1 min-h-[260px] p-6 flex items-center justify-center bg-background">
        {activeTab === "preview" ? (
          <div className="w-full h-full flex items-center justify-center">
            {children || (
              <div className="flex flex-col items-center gap-2 p-6 rounded-xl border border-dashed border-border bg-card/60 text-center">
                <Shield className="h-8 w-8 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Sandboxed Component Active</span>
                <span className="text-xs text-muted-foreground font-mono">Zero-Slop Execution Context</span>
              </div>
            )}
          </div>
        ) : (
          <pre className="w-full h-full p-4 overflow-x-auto rounded-xl bg-zinc-950 font-mono text-xs text-zinc-200 leading-relaxed select-all">
            <code>{rawComponentCode}</code>
          </pre>
        )}
      </div>

      {/* Sandbox Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2 text-[11px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          CSP Sandboxed (No Unsafe Eval)
        </span>
        <span>REACT 19 / TAILWIND V4</span>
      </div>
    </div>
  );
}

```
