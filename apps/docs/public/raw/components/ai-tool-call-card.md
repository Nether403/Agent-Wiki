---
id: "ai-tool-call-card"
name: "AI MCP Tool Call Inspector"
category: "ui:ai-native"
library_origin: "https://cult-ui.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "ai-native"
  - "agent-ui"
  - "mcp-tool"
  - "tool-call"
  - "agent"
  - "cult-ui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# AI MCP Tool Call Inspector (`ai-tool-call-card`)
> Visual inspector for MCP and agent tool executions, showing input parameters, live loading spinner, JSON inspector, and retry/error triggers.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, ai-native, agent-ui, mcp-tool, tool-call, agent, cult-ui
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-tool-call-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-tool-call-card.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

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
import {
  Terminal,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  Copy,
  Check,
  ChevronDown,
  Server,
  Code2,
} from "lucide-react";

export interface AiToolCallCardProps extends React.HTMLAttributes<HTMLDivElement> {
  serverName?: string;
  toolName: string;
  status: "idle" | "running" | "success" | "error";
  inputParameters: Record<string, unknown>;
  outputResult?: Record<string, unknown> | string;
  executionTimeMs?: number;
  errorMessage?: string;
  onRetry?: () => void;
}

export function AiToolCallCard({
  serverName = "design-agent-wiki",
  toolName,
  status = "success",
  inputParameters = {},
  outputResult,
  executionTimeMs = 180,
  errorMessage,
  onRetry,
  className,
  ...props
}: AiToolCallCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"input" | "output">("input");
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleCopy = () => {
    const dataToCopy =
      activeTab === "input"
        ? JSON.stringify(inputParameters, null, 2)
        : typeof outputResult === "string"
        ? outputResult
        : JSON.stringify(outputResult, null, 2);
    navigator.clipboard.writeText(dataToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRunning = status === "running";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border bg-card text-card-foreground shadow-sm transition-colors overflow-hidden",
        isError ? "border-destructive/60" : isRunning ? "border-primary/60" : "border-border",
        className
      )}
      role="region"
      aria-label={`MCP Tool Call: ${toolName}`}
      {...props}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-foreground">
                {toolName}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono">
                <Server className="h-3 w-3" aria-hidden="true" />
                {serverName}
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill & Collapse Toggle */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <RotateCw className="h-3 w-3 animate-spin" aria-hidden="true" />
              Executing ({executionTimeMs}ms)
            </span>
          ) : isSuccess ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
              <CheckCircle className="h-3 w-3" aria-hidden="true" />
              Passed ({executionTimeMs}ms)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Failed
            </span>
          )}

          {isError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              aria-label="Retry failed tool execution"
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand tool parameters" : "Collapse tool parameters"}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", isCollapsed && "-rotate-90")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!isCollapsed && (
        <div className="flex flex-col p-4 space-y-3">
          {/* Error Banner */}
          {isError && errorMessage && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-mono">{errorMessage}</span>
            </div>
          )}

          {/* Sub-Tabs: Input / Output */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("input")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  activeTab === "input"
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Arguments
              </button>
              {outputResult !== undefined && (
                <button
                  type="button"
                  onClick={() => setActiveTab("output")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    activeTab === "output"
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Result Payload
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied JSON payload" : "Copy JSON payload"}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                  <span className="text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          {/* JSON Inspector View */}
          <div className="relative rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs text-foreground overflow-x-auto max-h-64">
            <pre>
              {activeTab === "input"
                ? JSON.stringify(inputParameters, null, 2)
                : typeof outputResult === "string"
                ? outputResult
                : JSON.stringify(outputResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

```
