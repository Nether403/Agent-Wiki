---
id: "diff-hunk-viewer"
name: "Diff Hunk Viewer"
category: "ui:editorial"
library_origin: "https://github.com/primer/react"
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
  - "layout-block"
  - "primer"
  - "github"
  - "diff"
  - "code-review"
  - "git"
  - "syntax"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Diff Hunk Viewer (`diff-hunk-viewer`)
> GitHub Primer style split and unified side-by-side git diff viewer with hunk navigation, line additions, and inline reviews.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, primer, github, diff, code-review, git, syntax
- **Design Dials**: Variance 4/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add diff-hunk-viewer

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/diff-hunk-viewer.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Machine-First Design Agent Wiki (GitHub Primer Diff Archetype)
 * @license MIT
 * @curated-by Antigravity & manus-research
 */
"use client";

import React, { useState } from "react";
import { GitCommit, Split, AlignJustify, MessageSquare, Copy, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export type DiffLineType = "context" | "addition" | "deletion" | "header";

export interface DiffLine {
  oldLineNumber?: number;
  newLineNumber?: number;
  type: DiffLineType;
  content: string;
}

export interface DiffHunkViewerProps {
  fileName?: string;
  oldPath?: string;
  newPath?: string;
  diffLines?: DiffLine[];
  className?: string;
}

const SAMPLE_DIFF_LINES: DiffLine[] = [
  { type: "header", content: "@@ -14,7 +14,8 @@ export function createAgentPipeline() {" },
  { type: "context", oldLineNumber: 14, newLineNumber: 14, content: "  const session = await initializeSession();" },
  { type: "deletion", oldLineNumber: 15, content: "-  const prompt = `Perform query: ${input}`;" },
  { type: "addition", newLineNumber: 15, content: "+  const prompt = buildStructuredPrompt(input, systemContract);" },
  { type: "addition", newLineNumber: 16, content: "+  const telemetry = recordTokenAudit(prompt.length);" },
  { type: "context", oldLineNumber: 16, newLineNumber: 17, content: "  return session.dispatch(prompt);" },
  { type: "context", oldLineNumber: 17, newLineNumber: 18, content: "}" },
];

export function DiffHunkViewer({
  fileName = "packages/agent-core/src/pipeline.ts",
  diffLines = SAMPLE_DIFF_LINES,
  className,
}: DiffHunkViewerProps) {
  const [viewMode, setViewMode] = useState<"unified" | "split">("unified");
  const [copied, setCopied] = useState(false);
  const [activeCommentLine, setActiveCommentLine] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<Record<number, string[]>>({});

  const handleCopyDiff = () => {
    const rawText = diffLines.map((l) => l.content).join("\n");
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (lineNum: number) => {
    if (!commentDraft.trim()) return;
    setComments((prev) => ({
      ...prev,
      [lineNum]: [...(prev[lineNum] || []), commentDraft.trim()],
    }));
    setCommentDraft("");
    setActiveCommentLine(null);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-colors",
        className
      )}
      role="region"
      aria-label={`Code Diff View: ${fileName}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold text-foreground">{fileName}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("unified")}
              aria-pressed={viewMode === "unified"}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                viewMode === "unified"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <AlignJustify className="h-3 w-3" aria-hidden="true" />
              Unified
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              aria-pressed={viewMode === "split"}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                viewMode === "split"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Split className="h-3 w-3" aria-hidden="true" />
              Split
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyDiff}
            aria-label="Copy diff contents to clipboard"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy Raw"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto font-mono text-xs">
        <table className="w-full border-collapse">
          <tbody>
            {diffLines.map((line, idx) => {
              const isAddition = line.type === "addition";
              const isDeletion = line.type === "deletion";
              const isHeader = line.type === "header";
              const lineKey = line.newLineNumber || line.oldLineNumber || idx;
              const lineComments = comments[lineKey] || [];

              return (
                <React.Fragment key={idx}>
                  <tr
                    className={cn(
                      "group transition-colors",
                      isHeader && "bg-muted/60 text-muted-foreground font-medium",
                      isAddition && "bg-emerald-500/10 text-emerald-900 dark:text-emerald-300",
                      isDeletion && "bg-rose-500/10 text-rose-900 dark:text-rose-300",
                      line.type === "context" && "text-foreground hover:bg-muted/30"
                    )}
                  >
                    <td className="w-12 select-none border-r border-border/40 px-2 py-0.5 text-right text-[11px] text-muted-foreground">
                      {line.oldLineNumber || ""}
                    </td>
                    <td className="w-12 select-none border-r border-border/40 px-2 py-0.5 text-right text-[11px] text-muted-foreground">
                      {line.newLineNumber || ""}
                    </td>

                    <td className="w-6 select-none px-1 text-center font-bold">
                      {isAddition ? "+" : isDeletion ? "-" : " "}
                    </td>

                    <td className="relative px-3 py-0.5 whitespace-pre">
                      {line.content.replace(/^[+-]/, "")}
                      {!isHeader && (
                        <button
                          type="button"
                          onClick={() => setActiveCommentLine(activeCommentLine === lineKey ? null : lineKey)}
                          aria-label={`Add comment on line ${lineKey}`}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 inline-flex h-5 w-5 items-center justify-center rounded bg-background border border-border text-muted-foreground hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-opacity"
                        >
                          <MessageSquare className="h-3 w-3" aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  </tr>

                  {lineComments.map((comment, cIdx) => (
                    <tr key={`comment-${idx}-${cIdx}`} className="bg-muted/30">
                      <td colSpan={4} className="px-6 py-2">
                        <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
                          <span className="text-[11px] font-semibold text-primary">Review Comment:</span>
                          <p className="mt-1 text-xs text-foreground">{comment}</p>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {activeCommentLine === lineKey && (
                    <tr className="bg-muted/40">
                      <td colSpan={4} className="p-4">
                        <div className="rounded-lg border border-border bg-card p-3">
                          <label htmlFor={`comment-input-${lineKey}`} className="text-xs font-semibold text-foreground">
                            Leave Review Feedback on Line {lineKey}
                          </label>
                          <textarea
                            id={`comment-input-${lineKey}`}
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            placeholder="Type markdown review comment..."
                            rows={2}
                            className="mt-2 w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveCommentLine(null)}
                              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddComment(lineKey)}
                              className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              Add Comment
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```
