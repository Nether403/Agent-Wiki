/**
 * @license Apache-2.0
 * @origin Tremor UI (https://github.com/tremorlabs/tremor)
 * @author Tremor Labs & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  target: string;
  sparklineData: number[];
}

export interface KpiStatCardGroupProps {
  metrics?: KpiMetric[];
  className?: string;
}

const DEFAULT_METRICS: KpiMetric[] = [
  { id: "m1", title: "API Request Throughput", value: "2.4M", delta: "+14.2%", trend: "up", target: "2.0M target", sparklineData: [40, 55, 60, 75, 80, 95] },
  { id: "m2", title: "Mean Latency (P95)", value: "32ms", delta: "-4.8%", trend: "up", target: "< 45ms target", sparklineData: [45, 42, 38, 35, 34, 32] },
  { id: "m3", title: "Zero-Slop Health Score", value: "100%", delta: "0.0%", trend: "neutral", target: "100% threshold", sparklineData: [100, 100, 100, 100, 100, 100] },
  { id: "m4", title: "A11y Violations", value: "0", delta: "-100%", trend: "up", target: "0 max allowed", sparklineData: [4, 2, 1, 0, 0, 0] },
];

export function KpiStatCardGroup({
  metrics = DEFAULT_METRICS,
  className,
}: KpiStatCardGroupProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full", className)}>
      {metrics.map((metric) => {
        const TrendIcon =
          metric.trend === "up"
            ? TrendingUp
            : metric.trend === "down"
            ? TrendingDown
            : Minus;

        const isPositive =
          metric.trend === "up" || (metric.trend === "neutral" && metric.delta === "0.0%");

        return (
          <div
            key={metric.id}
            className="flex flex-col rounded-xl border border-border bg-card p-4 text-foreground shadow-sm transition-colors hover:border-muted-foreground/40"
          >
            <span className="text-xs font-medium text-muted-foreground">{metric.title}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight">{metric.value}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                )}
              >
                <TrendIcon className="h-3 w-3" aria-hidden="true" />
                {metric.delta}
              </span>
            </div>

            {/* Sparkline mini-track */}
            <div className="mt-3 flex items-end gap-1 h-6 w-full pt-1" aria-hidden="true">
              {metric.sparklineData.map((val, idx) => {
                const max = Math.max(...metric.sparklineData, 1);
                const heightPct = Math.max(15, Math.round((val / max) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 rounded-xs bg-primary/20 transition-all hover:bg-primary"
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            </div>

            <div className="mt-3 border-t border-border/60 pt-2 text-[11px] font-mono text-muted-foreground flex justify-between">
              <span>TARGET</span>
              <span>{metric.target}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
