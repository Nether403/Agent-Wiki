/**
 * @origin Tremor (https://github.com/tremorlabs/tremor)
 * @license Apache-2.0
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface BarListItem {
  name: string;
  value: number;
  href?: string;
  target?: string;
}

export interface ComparativeBarListProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarListItem[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
}

export function ComparativeBarList({
  data,
  valueFormatter = (val) => Intl.NumberFormat("en-US").format(val),
  showAnimation = true,
  className,
  ...props
}: ComparativeBarListProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <div
      className={cn("flex flex-col space-y-2 w-full", className)}
      role="region"
      aria-label="Comparative metric breakdown"
      {...props}
    >
      {data.map((item, idx) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

        return (
          <div
            key={item.name + idx}
            className="flex items-center justify-between space-x-4 text-sm"
          >
            <div className="relative flex-1 flex items-center h-8 rounded-lg bg-muted/40 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-lg bg-primary/20 transition-all",
                  showAnimation ? "duration-500" : "duration-0"
                )}
                style={{ width: `${Math.max(percentage, 2)}%` }}
              />
              <span className="absolute left-3 font-medium text-foreground truncate max-w-[80%]">
                {item.name}
              </span>
            </div>
            <span className="font-mono text-muted-foreground tabular-nums text-xs sm:text-sm font-semibold">
              {valueFormatter(item.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
