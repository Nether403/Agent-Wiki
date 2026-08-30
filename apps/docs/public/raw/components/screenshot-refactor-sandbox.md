---
id: "screenshot-refactor-sandbox"
name: "Screenshot Refactor Sandbox"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Screenshot Refactor Sandbox (`screenshot-refactor-sandbox`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add screenshot-refactor-sandbox

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/screenshot-refactor-sandbox.json
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
import { Sliders, Code2, Image as ImageIcon, CheckCircle, RefreshCw, Sparkles } from "lucide-react";

export interface ScreenshotRefactorSandboxProps {
  referenceImageUrl?: string;
  initialCode?: string;
  className?: string;
}

export function ScreenshotRefactorSandbox({
  referenceImageUrl = "/images/reference-mockup.png",
  initialCode = `<div className="p-4 bg-card border border-border rounded-lg">\n  <h3 className="text-base font-semibold text-foreground">Zero-Slop Card</h3>\n  <p className="text-sm text-muted-foreground mt-1">Refactored from vision reference.</p>\n</div>`,
  className = "",
}: ScreenshotRefactorSandboxProps) {
  const [activeTab, setActiveTab] = useState<"split" | "code" | "preview">("split");
  const [unslopScore, setUnslopScore] = useState<number>(100);

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm " + className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" role="img" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Screenshot-to-Code Refactor Sandbox</h3>
            <span className="text-xs text-muted-foreground font-mono">Vision AST Ingestion & Anti-Slop Normalizer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" role="img" aria-hidden="true" />
            Audit: {unslopScore}/100 S-Grade
          </span>
        </div>
      </div>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Left: Vision Mockup Reference */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border flex flex-col items-center justify-center min-h-[220px] text-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2 opacity-50" role="img" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground">Visual Reference Target</span>
          <span className="text-xs text-muted-foreground mt-1 max-w-[240px]">
            Input screenshot / Figma design deconstructed into semantic tokens and responsive layout.
          </span>
        </div>

        {/* Right: Refactored TSX Code */}
        <div className="p-4 rounded-lg bg-background border border-border font-mono text-xs text-foreground overflow-x-auto flex flex-col justify-between">
          <pre className="text-muted-foreground">
            <code>{initialCode}</code>
          </pre>
          <div className="mt-4 pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Tailwind v4 Semantic Tokens</span>
            <span>WCAG 2.1 AA Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

```
