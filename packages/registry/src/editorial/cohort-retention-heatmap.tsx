/**
 * @license MIT
 * @origin Tremor Raw / ReUI (https://tremor.so)
 * @author Tremor Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface CohortRow {
  cohort: string;
  size: number;
  retention: number[]; // e.g. [100, 82, 65, 54, 48, 42]
}

export interface CohortRetentionHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  periods?: string[];
  data?: CohortRow[];
}

const DEFAULT_PERIODS = ["M0", "M1", "M2", "M3", "M4", "M5"];

const DEFAULT_COHORTS: CohortRow[] = [
  { cohort: "Jan 2026", size: 1240, retention: [100, 78, 64, 58, 52, 49] },
  { cohort: "Feb 2026", size: 1450, retention: [100, 81, 68, 61, 55] },
  { cohort: "Mar 2026", size: 1820, retention: [100, 84, 72, 65] },
  { cohort: "Apr 2026", size: 2100, retention: [100, 86, 75] },
  { cohort: "May 2026", size: 2450, retention: [100, 88] },
  { cohort: "Jun 2026", size: 2900, retention: [100] },
];

export function CohortRetentionHeatmap({
  title = "User Retention Heatmap by Cohort",
  periods = DEFAULT_PERIODS,
  data = DEFAULT_COHORTS,
  className,
  ...props
}: CohortRetentionHeatmapProps) {
  const getCellColor = (pct: number) => {
    if (pct >= 85) return "bg-primary text-primary-foreground font-bold";
    if (pct >= 70) return "bg-primary/80 text-primary-foreground font-semibold";
    if (pct >= 55) return "bg-primary/50 text-foreground font-medium";
    if (pct >= 40) return "bg-primary/30 text-foreground";
    return "bg-primary/10 text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm space-y-4 overflow-x-auto",
        className
      )}
      role="region"
      aria-label={`Cohort Heatmap: ${title}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            Active Workspace Retention
          </p>
        </div>
      </div>

      {/* Heatmap Grid Table */}
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-mono">
            <th className="py-2.5 px-3 font-semibold">Cohort</th>
            <th className="py-2.5 px-3 font-semibold text-right">Users</th>
            {periods.map((p) => (
              <th key={p} className="py-2.5 px-3 font-semibold text-center">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.cohort} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
              <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                {row.cohort}
              </td>
              <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                {row.size.toLocaleString()}
              </td>
              {periods.map((_, idx) => {
                const val = row.retention[idx];
                if (val === undefined) {
                  return <td key={idx} className="py-2 px-3 text-center bg-muted/20" />;
                }
                return (
                  <td key={idx} className="p-1">
                    <div
                      className={cn(
                        "h-8 rounded-lg flex items-center justify-center font-mono text-xs transition-colors",
                        getCellColor(val)
                      )}
                    >
                      {val}%
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
