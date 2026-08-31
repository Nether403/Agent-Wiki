/**
 * @origin Machine-First Design Agent Wiki & AI Evaluation Harness
 * @license MIT
 * @author Machine-First Design Agent Wiki Team
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Clock, Zap, Cpu, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModelScoreboardEntry {
  modelName: string;
  provider: string;
  firstRunCompileRate: number; // percentage e.g. 96.5
  slopHealthScore: number; // 0-100 e.g. 98
  wcagComplianceRate: number; // percentage e.g. 100
  avgLatencyMs: number;
  costPer1kPromptsUsd: number;
  status: "verified" | "review" | "failed";
}

export interface AiAgentEvaluationScoreboardProps {
  entries?: ModelScoreboardEntry[];
  benchmarkTitle?: string;
  className?: string;
}

const DEFAULT_BENCHMARK_ENTRIES: ModelScoreboardEntry[] = [
  {
    modelName: "Claude 3.7 Sonnet (Agent-Native)",
    provider: "Anthropic",
    firstRunCompileRate: 98.4,
    slopHealthScore: 100,
    wcagComplianceRate: 100,
    avgLatencyMs: 820,
    costPer1kPromptsUsd: 3.2,
    status: "verified",
  },
  {
    modelName: "Gemini 2.5 Flash",
    provider: "Google",
    firstRunCompileRate: 96.2,
    slopHealthScore: 98,
    wcagComplianceRate: 100,
    avgLatencyMs: 310,
    costPer1kPromptsUsd: 0.45,
    status: "verified",
  },
  {
    modelName: "OpenAI GPT-4.5 Preview",
    provider: "OpenAI",
    firstRunCompileRate: 94.0,
    slopHealthScore: 95,
    wcagComplianceRate: 97.5,
    avgLatencyMs: 1150,
    costPer1kPromptsUsd: 7.5,
    status: "verified",
  },
  {
    modelName: "DeepSeek R1 Distill",
    provider: "DeepSeek",
    firstRunCompileRate: 91.8,
    slopHealthScore: 92,
    wcagComplianceRate: 95.0,
    avgLatencyMs: 980,
    costPer1kPromptsUsd: 0.8,
    status: "review",
  },
];

export function AiAgentEvaluationScoreboard({
  entries = DEFAULT_BENCHMARK_ENTRIES,
  benchmarkTitle = "Zero-Draft Fidelity Benchmark Gate",
  className,
}: AiAgentEvaluationScoreboardProps) {
  const [selectedSort, setSelectedSort] = React.useState<"compile" | "slop" | "speed">("compile");

  const sortedEntries = React.useMemo(() => {
    const list = [...entries];
    if (selectedSort === "compile") {
      return list.sort((a, b) => b.firstRunCompileRate - a.firstRunCompileRate);
    }
    if (selectedSort === "slop") {
      return list.sort((a, b) => b.slopHealthScore - a.slopHealthScore);
    }
    return list.sort((a, b) => a.avgLatencyMs - b.avgLatencyMs);
  }, [entries, selectedSort]);

  return (
    <div className={cn("w-full space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" role="img" aria-hidden="true" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {benchmarkTitle}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Headless sandbox performance & zero-slop metrics across leading coding models.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedSort("compile")}
            className={cn(
              "px-2.5 py-1 font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedSort === "compile" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Compilation Rate
          </button>
          <button
            type="button"
            onClick={() => setSelectedSort("slop")}
            className={cn(
              "px-2.5 py-1 font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedSort === "slop" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Slop Score
          </button>
          <button
            type="button"
            onClick={() => setSelectedSort("speed")}
            className={cn(
              "px-2.5 py-1 font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedSort === "speed" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Latency
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" role="table">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground font-semibold">
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3 text-right">Zero-Draft Compile</th>
              <th className="py-2.5 px-3 text-right">Anti-Slop Health</th>
              <th className="py-2.5 px-3 text-right">WCAG AA</th>
              <th className="py-2.5 px-3 text-right">Avg Latency</th>
              <th className="py-2.5 px-3 text-right">Cost / 1k</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono">
            {sortedEntries.map((m, idx) => (
              <tr
                key={m.modelName}
                className={cn(
                  "hover:bg-muted/30 transition-colors duration-150",
                  idx === 0 && "bg-primary/5"
                )}
              >
                <td className="py-3 px-3 font-sans">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    {idx === 0 && <Award className="h-3.5 w-3.5 text-amber-500" role="img" aria-hidden="true" />}
                    {m.modelName}
                  </div>
                  <div className="text-2xs text-muted-foreground font-mono">{m.provider}</div>
                </td>
                <td className="py-3 px-3 text-right font-semibold text-foreground">
                  <span className={cn(m.firstRunCompileRate >= 95 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500")}>
                    {m.firstRunCompileRate}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right text-foreground font-medium">
                  {m.slopHealthScore}/100
                </td>
                <td className="py-3 px-3 text-right text-foreground font-medium">
                  {m.wcagComplianceRate}%
                </td>
                <td className="py-3 px-3 text-right text-muted-foreground tabular-nums">
                  {m.avgLatencyMs}ms
                </td>
                <td className="py-3 px-3 text-right text-muted-foreground tabular-nums">
                  \${m.costPer1kPromptsUsd.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-3xs font-semibold uppercase tracking-wider",
                      m.status === "verified"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {m.status === "verified" ? (
                      <>
                        <CheckCircle2 className="h-2.5 w-2.5" role="img" aria-hidden="true" /> Verified
                      </>
                    ) : (
                      <>
                        <Clock className="h-2.5 w-2.5" role="img" aria-hidden="true" /> In Review
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
