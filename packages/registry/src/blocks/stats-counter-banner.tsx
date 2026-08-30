/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface MetricItem {
  value: string;
  label: string;
  subtext?: string;
}

export interface StatsCounterBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics?: MetricItem[];
}

const DEFAULT_METRICS: MetricItem[] = [
  { value: "110+", label: "Verified Components", subtext: "Zero AI slop" },
  { value: "30", label: "Anti-Slop Rules", subtext: "Strict AST quality gate" },
  { value: "<15KB", label: "Payload Budget", subtext: "Guaranteed context bound" },
  { value: "11/11", label: "Agent Platforms", subtext: "100% test compliance" },
];

export function StatsCounterBanner({
  metrics = DEFAULT_METRICS,
  className,
  ...props
}: StatsCounterBannerProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-2xl border border-border bg-card shadow-sm text-card-foreground",
        className
      )}
      aria-label="Platform Telemetry & Metrics"
      {...props}
    >
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col items-center text-center p-3 space-y-1">
          <span className="text-3xl md:text-4xl font-black text-foreground tracking-tight font-mono">
            {m.value}
          </span>
          <span className="text-xs font-semibold text-foreground">{m.label}</span>
          {m.subtext && <span className="text-[11px] text-muted-foreground">{m.subtext}</span>}
        </div>
      ))}
    </section>
  );
}
