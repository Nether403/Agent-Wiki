/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Gauge, AlertTriangle } from "lucide-react";

export interface AiTokenMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  usedTokens: number;
  maxTokens: number;
  costEstimateUsd?: number;
}

export function AiTokenMeter({
  usedTokens = 42500,
  maxTokens = 128000,
  costEstimateUsd,
  className,
  ...props
}: AiTokenMeterProps) {
  const percentage = Math.min(100, Math.round((usedTokens / maxTokens) * 100));
  const isHigh = percentage > 85;
  const isMed = percentage > 60 && !isHigh;

  return (
    <div
      className={cn(
        "flex flex-col p-3 rounded-xl border border-border bg-card text-card-foreground shadow-xs w-full max-w-xs space-y-2",
        className
      )}
      role="region"
      aria-label="Context Window Token Budget Meter"
      {...props}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Gauge className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>Context Budget</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-2 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={usedTokens}
        aria-valuemin={0}
        aria-valuemax={maxTokens}
        aria-label="Context Window Utilization"
      >
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            isHigh ? "bg-destructive" : isMed ? "bg-amber-500" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span>{(usedTokens / 1000).toFixed(1)}k used</span>
        <span>{(maxTokens / 1000).toFixed(0)}k limit</span>
      </div>

      {costEstimateUsd !== undefined && (
        <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Est. Session Cost:</span>
          <span className="font-mono font-semibold text-foreground">${costEstimateUsd.toFixed(4)}</span>
        </div>
      )}
    </div>
  );
}
