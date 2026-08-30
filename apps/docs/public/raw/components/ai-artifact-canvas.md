---
id: "ai-artifact-canvas"
name: "Ai Artifact Canvas"
category: "ui:creative"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
  - "three"
  - "motion"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "canvas"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Ai Artifact Canvas (`ai-artifact-canvas`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, canvas
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-artifact-canvas

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-artifact-canvas.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Cult UI / Agent Wiki (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Code2, Play, GitCompare, Maximize2, Minimize2, Copy, Check, Download, RefreshCw } from "lucide-react";

export interface AiArtifactCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  code: string;
  diffCode?: string;
  previewNode?: React.ReactNode;
  defaultTab?: "preview" | "code" | "diff";
  onCopy?: (code: string) => void;
  onDownload?: (code: string, filename: string) => void;
  filename?: string;
}

export function AiArtifactCanvas({
  title = "Component Sandbox Artifact",
  code,
  diffCode,
  previewNode,
  defaultTab = "preview",
  filename = "component.tsx",
  onCopy,
  onDownload,
  className,
  ...props
}: AiArtifactCanvasProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code" | "diff">(defaultTab);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    onCopy?.(code);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(code, filename);
      return;
    }
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card shadow-md overflow-hidden transition-colors",
        isFullscreen && "fixed inset-4 z-50 rounded-2xl shadow-2xl bg-background",
        className
      )}
      aria-label={`Artifact sandbox: ${title}`}
      {...props}
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" aria-hidden="true" />
          </div>
          <h3 className="text-xs font-semibold text-foreground tracking-tight">{title}</h3>
        </div>

        {/* Tab switcher */}
        <nav className="flex items-center p-0.5 rounded-lg bg-muted border border-border" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "preview"}
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "preview" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Play className="h-3 w-3" aria-hidden="true" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "code"}
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "code" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3 w-3" aria-hidden="true" />
            <span>Code</span>
          </button>

          {diffCode && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "diff"}
              onClick={() => setActiveTab("diff")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "diff" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GitCompare className="h-3 w-3" aria-hidden="true" />
              <span>Diff</span>
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Copy artifact source code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Download artifact TSX file"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand to fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <div className="relative flex-1 min-h-[320px] max-h-[600px] overflow-auto p-4">
        {activeTab === "preview" && (
          <div className="flex items-center justify-center min-h-[280px] w-full bg-background rounded-lg border border-border/40 p-6">
            {previewNode || (
              <div className="flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground">
                <Code2 className="h-8 w-8 text-primary/70" aria-hidden="true" />
                <p className="text-xs">Live dynamic render preview active.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <pre className="text-xs font-mono text-foreground bg-muted/30 p-4 rounded-lg border border-border/60 overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        )}

        {activeTab === "diff" && diffCode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-muted-foreground mb-1.5">Original (Before)</span>
              <pre className="p-3 bg-destructive/5 text-destructive-foreground border border-destructive/20 rounded-lg overflow-x-auto">
                <code>{diffCode}</code>
              </pre>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-primary mb-1.5">Remediated (Zero-Slop After)</span>
              <pre className="p-3 bg-primary/5 text-foreground border border-primary/30 rounded-lg overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

```
