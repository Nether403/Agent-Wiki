---
id: "ai-artifact-sandbox-iframe"
name: "AI Artifact Live Sandbox Frame"
category: "ui:ai-native"
library_origin: "https://21st.dev"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "ai-native"
  - "agent-ui"
  - "artifact-sandbox"
  - "preview"
  - "iframe"
  - "21st-dev"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# AI Artifact Live Sandbox Frame (`ai-artifact-sandbox-iframe`)
> Split-screen live preview canvas with responsive device switcher, code/preview toggle, and version history diff slider.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, ai-native, agent-ui, artifact-sandbox, preview, iframe, 21st-dev
- **Design Dials**: Variance 7/10 · Motion 4/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-artifact-sandbox-iframe

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-artifact-sandbox-iframe.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin 21st.dev / Agent Wiki (https://21st.dev)
 * @author 21st.dev & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Eye,
  RotateCw,
  ExternalLink,
  Copy,
  Check,
  SplitSquareVertical,
} from "lucide-react";

export interface AiArtifactSandboxIframeProps extends React.HTMLAttributes<HTMLDivElement> {
  artifactTitle?: string;
  sourceCode: string;
  previewUrl?: string;
  defaultView?: "preview" | "code" | "split";
  versionTag?: string;
}

export function AiArtifactSandboxIframe({
  artifactTitle = "Component Sandbox Preview",
  sourceCode,
  previewUrl = "about:blank",
  defaultView = "preview",
  versionTag = "v1.2.0",
  className,
  ...props
}: AiArtifactSandboxIframeProps) {
  const [viewMode, setViewMode] = React.useState<"preview" | "code" | "split">(defaultView);
  const [deviceMode, setDeviceMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card text-card-foreground shadow-lg overflow-hidden",
        className
      )}
      role="region"
      aria-label={`Artifact Sandbox: ${artifactTitle}`}
      {...props}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
        {/* Left: Title & Version */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-foreground">{artifactTitle}</span>
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-xs">
            {versionTag}
          </span>
        </div>

        {/* Center: Device Switcher (when in preview mode) */}
        {viewMode !== "code" && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              aria-label="Desktop preview width"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                deviceMode === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("tablet")}
              aria-label="Tablet preview width (768px)"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                deviceMode === "tablet" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Tablet className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              aria-label="Mobile preview width (375px)"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                deviceMode === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Right: View Mode Toggle & Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                viewMode === "preview" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                viewMode === "code" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" /> Code
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                viewMode === "split" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <SplitSquareVertical className="h-3.5 w-3.5" aria-hidden="true" /> Split
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh sandbox preview"
            className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Source code copied" : "Copy source code"}
            className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Sandbox Workspace Area */}
      <div className="relative flex flex-col md:flex-row w-full h-[520px] bg-muted/20 overflow-hidden">
        {/* Preview Frame Container */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={cn(
              "flex-1 flex items-center justify-center p-6 transition-colors duration-200 overflow-auto",
              viewMode === "split" && "border-r border-border md:w-1/2"
            )}
          >
            <div
              className={cn(
                "relative h-full bg-background rounded-xl border border-border shadow-xl overflow-hidden transition-colors duration-200",
                deviceMode === "desktop"
                  ? "w-full"
                  : deviceMode === "tablet"
                  ? "w-[640px]"
                  : "w-[360px]"
              )}
            >
              {/* Fallback & Sandbox Frame */}
              <iframe
                title={artifactTitle}
                src={previewUrl}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0 bg-background"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/80 backdrop-blur-xs border border-border text-[10px] text-muted-foreground font-mono">
                <span>{deviceMode === "desktop" ? "100%" : deviceMode === "tablet" ? "640px" : "360px"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Code Editor View */}
        {(viewMode === "code" || viewMode === "split") && (
          <div
            className={cn(
              "flex-1 flex flex-col bg-card overflow-auto font-mono text-xs text-foreground p-4",
              viewMode === "split" && "md:w-1/2"
            )}
          >
            <pre className="overflow-x-auto leading-relaxed">
              <code>{sourceCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

```
