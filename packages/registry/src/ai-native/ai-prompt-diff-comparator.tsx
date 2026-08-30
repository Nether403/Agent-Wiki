/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:ai-native
 * Name: ai-prompt-diff-comparator
 */

import * as React from "react";
import { GitCompare, Check, X, ArrowRight, DollarSign, Layers } from "lucide-react";

export interface DiffChunk {
  id: string;
  type: "unchanged" | "added" | "removed" | "modified";
  originalText?: string;
  modifiedText?: string;
  status: "pending" | "accepted" | "rejected";
}

export interface PromptDiffComparatorProps {
  originalTitle?: string;
  modifiedTitle?: string;
  modelA?: string;
  modelB?: string;
  chunks?: DiffChunk[];
  onAcceptChunk?: (chunkId: string) => void;
  onRejectChunk?: (chunkId: string) => void;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
  className?: string;
}

export const AiPromptDiffComparator: React.FC<PromptDiffComparatorProps> = ({
  originalTitle = "Version 1.0 (Baseline)",
  modifiedTitle = "Version 2.0 (Optimized Prompt)",
  modelA = "Claude 3.5 Sonnet",
  modelB = "Gemini 1.5 Pro",
  chunks: initialChunks = [
    {
      id: "chunk-1",
      type: "unchanged",
      originalText: "You are an expert design engineer tasked with reviewing interface code.",
      modifiedText: "You are an expert design engineer tasked with reviewing interface code.",
      status: "accepted",
    },
    {
      id: "chunk-2",
      type: "removed",
      originalText: "Create a generic button with hardcoded indigo color styling.",
      status: "pending",
    },
    {
      id: "chunk-3",
      type: "added",
      modifiedText: "Enforce WCAG 2.1 AA contrast rules and use strict Tailwind v4 semantic tokens.",
      status: "pending",
    },
    {
      id: "chunk-4",
      type: "modified",
      originalText: "Avoid any type errors where possible.",
      modifiedText: "Strictly ban chained type assertions and conditional empty object spreads.",
      status: "pending",
    },
  ],
  onAcceptChunk,
  onRejectChunk,
  onAcceptAll,
  onRejectAll,
  className = "",
}) => {
  const [chunks, setChunks] = React.useState<DiffChunk[]>(initialChunks);

  const handleAction = (id: string, action: "accept" | "reject") => {
    setChunks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action === "accept" ? "accepted" : "rejected" } : c))
    );
    if (action === "accept") onAcceptChunk?.(id);
    else onRejectChunk?.(id);
  };

  const handleBatch = (action: "accept" | "reject") => {
    setChunks((prev) => prev.map((c) => ({ ...c, status: action === "accept" ? "accepted" : "rejected" })));
    if (action === "accept") onAcceptAll?.();
    else onRejectAll?.();
  };

  const pendingCount = chunks.filter((c) => c.status === "pending").length;

  return (
    <section
      aria-label="AI Prompt Diff Comparator"
      className={`flex flex-col w-full max-w-4xl mx-auto rounded-xl bg-card border border-border text-card-foreground shadow-lg overflow-hidden ${className}`}
    >
      {/* Top Header & Model Info */}
      <header className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" role="img" aria-label="Diff Icon" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Prompt Diff & Version Review</h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-muted border border-border text-muted-foreground">
            {pendingCount} changes pending
          </span>
        </div>

        <div className="flex items-center gap-2" role="toolbar" aria-label="Bulk actions">
          <button
            type="button"
            onClick={() => handleBatch("accept")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Check className="w-3.5 h-3.5" />
            Accept All
          </button>
          <button
            type="button"
            onClick={() => handleBatch("reject")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-3.5 h-3.5" />
            Reject All
          </button>
        </div>
      </header>

      {/* Comparison Column Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border bg-muted/40 text-xs font-mono text-muted-foreground divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-3 flex items-center justify-between">
          <span className="font-semibold text-foreground">{originalTitle}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-background border border-border">{modelA}</span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="font-semibold text-foreground">{modifiedTitle}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-background border border-border">{modelB}</span>
        </div>
      </div>

      {/* Diff Stream Chunks */}
      <div className="divide-y divide-border font-mono text-xs max-h-[500px] overflow-y-auto">
        {chunks.map((chunk) => {
          return (
            <article
              key={chunk.id}
              aria-label={`Diff Chunk ${chunk.id}: ${chunk.type}`}
              className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border group hover:bg-muted/10 transition-colors"
            >
              {/* Left Side: Original */}
              <div
                className={`p-4 ${
                  chunk.type === "removed"
                    ? "bg-rose-950/20 text-rose-300 line-through opacity-80"
                    : chunk.type === "modified"
                    ? "bg-amber-950/20 text-amber-300"
                    : "text-muted-foreground"
                }`}
              >
                {chunk.originalText || <span className="italic text-muted-foreground/40">[No original text]</span>}
              </div>

              {/* Right Side: Modified & Chunk Actions */}
              <div
                className={`p-4 flex flex-col justify-between gap-3 ${
                  chunk.type === "added"
                    ? "bg-emerald-950/20 text-emerald-300"
                    : chunk.type === "modified"
                    ? "bg-emerald-950/20 text-emerald-300"
                    : "text-muted-foreground"
                }`}
              >
                <div className="flex-1">
                  {chunk.modifiedText || <span className="italic text-muted-foreground/40">[Removed in version]</span>}
                </div>

                {chunk.type !== "unchanged" && (
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                    <span className="text-muted-foreground capitalize">
                      Status:{" "}
                      <strong
                        className={
                          chunk.status === "accepted"
                            ? "text-emerald-400"
                            : chunk.status === "rejected"
                            ? "text-rose-400"
                            : "text-amber-400"
                        }
                      >
                        {chunk.status}
                      </strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAction(chunk.id, "accept")}
                        aria-label={`Accept chunk ${chunk.id}`}
                        className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(chunk.id, "reject")}
                        aria-label={`Reject chunk ${chunk.id}`}
                        className="p-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer Metrics */}
      <footer className="flex flex-wrap items-center justify-between gap-4 p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-primary" role="img" aria-label="Token Count" />
            Tokens: <strong>342</strong> &rarr; <strong>318</strong> (-7%)
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" role="img" aria-label="Cost" />
            Est. Cost / 1k Calls: <strong>$0.0048</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span>Verified Zero-Slop</span>
          <ArrowRight className="w-3 h-3 text-primary" />
        </div>
      </footer>
    </section>
  );
};
export default AiPromptDiffComparator;
