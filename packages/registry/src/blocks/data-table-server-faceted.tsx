/**
 * @license MIT
 * @origin Primer React / Tremor UI
 * @author GitHub Primer Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, CheckCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableRowItem {
  id: string;
  name: string;
  category: string;
  status: "verified" | "flagged" | "review";
  varianceDial: number;
  lastUpdated: string;
}

export interface DataTableServerFacetedProps {
  initialItems?: TableRowItem[];
  className?: string;
}

const DEFAULT_ROWS: TableRowItem[] = [
  { id: "comp-1", name: "agent-node-graph.tsx", category: "ui:workflow", status: "verified", varianceDial: 6, lastUpdated: "2026-08-30" },
  { id: "comp-2", name: "smooth-scroll-provider.tsx", category: "ui:motion", status: "verified", varianceDial: 4, lastUpdated: "2026-08-30" },
  { id: "comp-3", name: "mesh-gradient-shader.tsx", category: "ui:creative", status: "verified", varianceDial: 8, lastUpdated: "2026-08-30" },
  { id: "comp-4", name: "kpi-stat-card-group.tsx", category: "ui:block", status: "verified", varianceDial: 5, lastUpdated: "2026-08-30" },
  { id: "comp-5", name: "color-picker-primitive.tsx", category: "ui:primitive", status: "verified", varianceDial: 3, lastUpdated: "2026-08-30" },
];

export function DataTableServerFaceted({
  initialItems = DEFAULT_ROWS,
  className,
}: DataTableServerFacetedProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialItems, searchTerm, selectedCategory]);

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-foreground overflow-hidden shadow-sm",
        className
      )}
      role="region"
      aria-label="Server-Faceted Data Table"
    >
      {/* Table Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border bg-muted/20 p-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter components by name..."
            aria-label="Search components"
            className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by taxonomy category"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="ui:workflow">Workflow</option>
            <option value="ui:motion">Motion</option>
            <option value="ui:creative">Creative</option>
            <option value="ui:block">Blocks</option>
            <option value="ui:primitive">Primitives</option>
          </select>
        </div>
      </div>

      {/* Accessible Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/40 font-mono text-[11px] text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Component</th>
              <th scope="col" className="px-4 py-3 font-medium">Category</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Variance</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No components matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">{item.varianceDial}/10</td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {item.lastUpdated}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
        <span>Showing {filteredItems.length} entries</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            className="p-1 rounded-md border border-border bg-background transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="p-1 rounded-md border border-border bg-background transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
