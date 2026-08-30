/**
 * @license MIT
 * @origin Diagram Design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface MatrixItem {
  id: string;
  title: string;
  x: number; // 0 to 100 (horizontal axis: e.g. Effort or Cost)
  y: number; // 0 to 100 (vertical axis: e.g. Impact or Value)
  category?: string;
  description?: string;
}

export interface TwoByTwoPrioritizationMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  xAxisLabel?: string;
  yAxisLabel?: string;
  quadrantLabels?: {
    topLeft?: string;     // High Impact, Low Effort (Quick Wins)
    topRight?: string;    // High Impact, High Effort (Major Projects)
    bottomLeft?: string;  // Low Impact, Low Effort (Fill-ins)
    bottomRight?: string; // Low Impact, High Effort (Thankless Tasks)
  };
  items?: MatrixItem[];
  onSelectItem?: (item: MatrixItem) => void;
}

export function TwoByTwoPrioritizationMatrix({
  xAxisLabel = "Effort / Complexity →",
  yAxisLabel = "↑ Impact / Business Value",
  quadrantLabels = {
    topLeft: "Quick Wins (High Impact, Low Effort)",
    topRight: "Strategic Bets (High Impact, High Effort)",
    bottomLeft: "Fill-Ins (Low Impact, Low Effort)",
    bottomRight: "Deprioritize (Low Impact, High Effort)",
  },
  items = [
    { id: "1", title: "AST Slop Linter", x: 25, y: 85, category: "Core Tooling" },
    { id: "2", title: "MCP Registry Server", x: 35, y: 90, category: "Distribution" },
    { id: "3", title: "Automated Sandbox E2E", x: 75, y: 80, category: "Quality Gate" },
    { id: "4", title: "Full Video Codemods", x: 85, y: 40, category: "Experimental" },
    { id: "5", title: "CLI Shortcut Alias", x: 20, y: 35, category: "DX" },
  ],
  onSelectItem,
  className,
  ...props
}: TwoByTwoPrioritizationMatrixProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(items[0]?.id || null);

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-6 shadow-sm text-card-foreground flex flex-col gap-6",
        className
      )}
      {...props}
    >
      {/* Header & Axis Legends */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">2×2 Prioritization Matrix</h3>
          <p className="text-xs text-muted-foreground">
            Evaluate strategic trade-offs and component priorities across impact vs effort.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="px-2 py-0.5 rounded-md bg-muted border border-border">{yAxisLabel}</span>
          <span className="px-2 py-0.5 rounded-md bg-muted border border-border">{xAxisLabel}</span>
        </div>
      </div>

      {/* Main 2x2 Canvas */}
      <div className="relative w-full aspect-square sm:aspect-16/10 rounded-xl border border-border bg-background/50 overflow-hidden flex flex-col">
        {/* Quadrant Grid Background Lines */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 divide-x divide-y divide-border pointer-events-none">
          {/* Top-Left Quadrant */}
          <div className="p-3 bg-emerald-500/5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-500 tracking-wide uppercase">
              {quadrantLabels.topLeft}
            </span>
          </div>

          {/* Top-Right Quadrant */}
          <div className="p-3 bg-primary/5 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-primary tracking-wide uppercase">
              {quadrantLabels.topRight}
            </span>
          </div>

          {/* Bottom-Left Quadrant */}
          <div className="p-3 bg-muted/20 flex flex-col justify-end">
            <span className="text-[11px] font-bold text-muted-foreground tracking-wide uppercase">
              {quadrantLabels.bottomLeft}
            </span>
          </div>

          {/* Bottom-Right Quadrant */}
          <div className="p-3 bg-destructive/5 flex flex-col justify-end">
            <span className="text-[11px] font-bold text-destructive/80 tracking-wide uppercase">
              {quadrantLabels.bottomRight}
            </span>
          </div>
        </div>

        {/* Center Crosshairs */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 pointer-events-none" aria-hidden="true" />

        {/* Interactive Placed Items */}
        <div className="relative flex-1">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  onSelectItem?.(item);
                }}
                style={{
                  left: `${Math.min(92, Math.max(8, item.x))}%`,
                  bottom: `${Math.min(92, Math.max(8, item.y))}%`,
                }}
                className={cn(
                  "absolute -translate-x-1/2 translate-y-1/2 group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring z-10",
                  isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/40 scale-105"
                    : "bg-card hover:bg-muted text-foreground border border-border"
                )}
                aria-label={`${item.title} at ${item.x}% effort, ${item.y}% impact`}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    item.y >= 50 && item.x <= 50
                      ? "bg-emerald-500"
                      : item.y >= 50 && item.x > 50
                      ? "bg-primary"
                      : item.y < 50 && item.x <= 50
                      ? "bg-muted-foreground"
                      : "bg-destructive"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate max-w-[130px]">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Item Drawer / Detail Inspector */}
      {selectedItem && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{selectedItem.title}</span>
            {selectedItem.category && (
              <span className="px-2 py-0.5 rounded-md bg-background border border-border text-muted-foreground font-mono text-[10px]">
                {selectedItem.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground font-mono">
            <span>Impact: <strong className="text-foreground">{selectedItem.y}%</strong></span>
            <span>Effort: <strong className="text-foreground">{selectedItem.x}%</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
