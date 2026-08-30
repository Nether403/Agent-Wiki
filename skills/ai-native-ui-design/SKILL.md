---
name: ai-native-ui-design
description: Design patterns for modern AI-native interfaces: human-in-the-loop diffing, reasoning accordions, streaming tokens, prompt command bars, token budget flamegraphs, and sandboxed generative UI.
---

# AI-Native Interface Design Skill

You are an expert AI-native interface designer and systems architect. This document outlines the design language, mental models, and interactive standards for AI agents, multi-agent consoles, and generative workflows.

---

## 1. The 6 Pillars of AI-Native UI

1. **Deterministic State Reflection**: Never hide agent execution behind a generic spinner. Show explicit pipeline steps (`Planning` $\rightarrow$ `Searching` $\rightarrow$ `Compiling` $\rightarrow$ `Verified`).
2. **Transparent Reasoning Foldouts**: Progressive disclosure for Chain-of-Thought (CoT) and subagent delegation traces. Collapse by default, expand on user request.
3. **Human-in-the-Loop Diffs**: Before executing high-impact actions (file writes, database mutations, deployment), present side-by-side or inline color-coded semantic diffs.
4. **Token & Budget Flamegraphs**: Expose context window utilization, system prompt overhead, and memory cache hit rates with visual gauges.
5. **Sandboxed Generative UI**: Isolate dynamic React components or HTML artifacts in secure iframe/Shadow DOM containers with fallback boundaries.
6. **Probabilistic Confidence Indicators**: When presenting AI citations or factual assertions, pair findings with calibrated confidence badges (e.g. 98% grounded in verified source).

---

## 2. Token Streaming & Cursor Animation

```tsx
import * as React from "react";
import { cn } from "../lib/utils";

export function StreamingTokenText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  return (
    <span className="relative inline font-sans text-sm leading-relaxed text-foreground">
      {text}
      {isStreaming && (
        <span
          className="inline-block h-4 w-1.5 ml-0.5 bg-primary rounded-xs align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
```

---

## 3. Human-in-the-Loop Diff Pattern

```tsx
export function DiffLine({ type, content }: { type: "add" | "delete" | "same"; content: string }) {
  const styles = {
    add: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500",
    delete: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-l-2 border-rose-500 line-through opacity-75",
    same: "bg-transparent text-muted-foreground border-l-2 border-transparent",
  };

  return (
    <div className={cn("px-3 py-1 font-mono text-xs flex items-center gap-2", styles[type])}>
      <span className="select-none w-3 text-center font-bold">
        {type === "add" ? "+" : type === "delete" ? "-" : " "}
      </span>
      <span className="truncate">{content}</span>
    </div>
  );
}
```
