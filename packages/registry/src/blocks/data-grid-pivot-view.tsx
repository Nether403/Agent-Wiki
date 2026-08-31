/**
 * @origin Machine-First Design Agent Wiki (ReUI / AG-Grid Pivot Archetype)
 * @license MIT
 * @curated-by Antigravity & manus-research
 */
"use client";

import React, { useState, useMemo } from "react";
import { Table, ArrowUpDown, ChevronDown, Group, SlidersHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface GridRow {
  id: string;
  category: string;
  component: string;
  stars: number;
  healthScore: number;
  a11yStatus: "PASS" | "WARN";
}

const SAMPLE_GRID_ROWS: GridRow[] = [
  { id: "1", category: "ui:primitive", component: "faceted-query-builder", stars: 4200, healthScore: 100, a11yStatus: "PASS" },
  { id: "2", category: "ui:primitive", component: "combobox-grouped-async", stars: 3800, healthScore: 100, a11yStatus: "PASS" },
  { id: "3", category: "ui:editorial", component: "diff-hunk-viewer", stars: 5600, healthScore: 100, a11yStatus: "PASS" },
  { id: "4", category: "ui:block", component: "multi-pane-workspace", stars: 8900, healthScore: 100, a11yStatus: "PASS" },
  { id: "5", category: "ui:block", component: "data-grid-pivot-view", stars: 7400, healthScore: 100, a11yStatus: "PASS" },
  { id: "6", category: "ui:motion", component: "dock-magnification", stars: 12400, healthScore: 100, a11yStatus: "PASS" },
];

export function DataGridPivotView({
  rows = SAMPLE_GRID_ROWS,
  className,
}: {
  rows?: GridRow[];
  className?: string;
}) {
  const [groupBy, setGroupBy] = useState<"none" | "category">("category");
  const [sortField, setSortField] = useState<keyof GridRow>("stars");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof GridRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [rows, sortField, sortAsc]);

  const groupedData = useMemo(() => {
    if (groupBy === "none") return { "All Items": sortedRows };
    return sortedRows.reduce<Record<string, GridRow[]>>((acc, row) => {
      acc[row.category] = acc[row.category] || [];
      acc[row.category].push(row);
      return acc;
    }, {});
  }, [sortedRows, groupBy]);

  const totalStars = useMemo(() => rows.reduce((sum, r) => sum + r.stars, 0), [rows]);
  const avgHealth = useMemo(
    () => (rows.length ? Math.round(rows.reduce((sum, r) => sum + r.healthScore, 0) / rows.length) : 100),
    [rows]
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-colors",
        className
      )}
      role="region"
      aria-label="Enterprise Data Grid Pivot Table"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="text-xs font-semibold tracking-tight text-foreground">Registry Pivot Data Grid</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Group By:</span>
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setGroupBy("none")}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                groupBy === "none" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Flat
            </button>
            <button
              type="button"
              onClick={() => setGroupBy("category")}
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                groupBy === "category" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Group className="h-3 w-3" aria-hidden="true" />
              Category
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Component Slug</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("stars")}
                  className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
                >
                  Adoption Stars
                  {sortField === "stars" ? (
                    sortAsc ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="px-4 py-2.5 font-medium">Anti-Slop Health</th>
              <th className="px-4 py-2.5 font-medium">WCAG AA</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([groupTitle, groupRows]) => (
              <React.Fragment key={groupTitle}>
                {groupBy !== "none" && (
                  <tr className="border-b border-border bg-muted/20 font-semibold text-foreground">
                    <td colSpan={5} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                          {groupTitle}
                        </span>
                        <span className="text-[11px] text-muted-foreground">({groupRows.length} items)</span>
                      </div>
                    </td>
                  </tr>
                )}

                {groupRows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 transition-colors hover:bg-muted/40">
                    <td className="px-4 py-2 font-mono font-medium text-foreground">{row.component}</td>
                    <td className="px-4 py-2 text-muted-foreground">{row.category}</td>
                    <td className="px-4 py-2 font-medium text-foreground">{row.stars.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.healthScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ {row.a11yStatus}</span>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-semibold text-foreground">
              <td className="px-4 py-2.5">Aggregate Summary</td>
              <td className="px-4 py-2.5 text-muted-foreground">{rows.length} Total Components</td>
              <td className="px-4 py-2.5 text-foreground">{totalStars.toLocaleString()} Stars</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">{avgHealth}/100 Average</td>
              <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400">100% PASS</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
