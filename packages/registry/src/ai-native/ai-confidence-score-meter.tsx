/**
 * @license MIT
 * @origin 21st.dev & Machine-First Design Agent Wiki
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ShieldCheck, Info, ExternalLink } from "lucide-react";

export interface CitationSource {
  title: string;
  url?: string;
  relevancePercent: number;
}

export interface ConfidenceScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0 to 100
  reasoningSummary?: string;
  sources?: CitationSource[];
}

export function AiConfidenceScoreMeter({
  score = 96,
  reasoningSummary = "Verified against AST dependency graphs and official W3C / WCAG 2.1 AA specifications.",
  sources = [
    { title: "Radix UI Primitives API Contract", relevancePercent: 98 },
    { title: "Tailwind CSS v4 Standard Tokens", relevancePercent: 94 },
  ],
  className,
  ...props
}: ConfidenceScoreProps) {
  const getBadgeColor = (s: number) => {
    if (s >= 90) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    if (s >= 75) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
  };

  return (
    <div
      className={cn("w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4", className)}
      role="region"
      aria-label="AI Verification and Confidence Gauge"
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Grounded Confidence Score
          </h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold",
            getBadgeColor(score)
          )}
        >
          {score}% GROUNDED
        </span>
      </div>

      {/* Visual Score Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${score}%`, transition: "width 500ms ease-out" }}
        />
      </div>

      {reasoningSummary && (
        <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
          <span>{reasoningSummary}</span>
        </p>
      )}

      {sources.length > 0 && (
        <div className="space-y-1.5 border-t border-border pt-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Citation References:
          </span>
          <div className="space-y-1">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs text-foreground bg-muted/30 px-2.5 py-1.5 rounded-lg"
              >
                <span className="truncate">{src.title}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{src.relevancePercent}% Match</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
