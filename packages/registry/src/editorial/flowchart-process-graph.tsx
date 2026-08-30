/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface FlowchartProcessGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function FlowchartProcessGraph({
  title = "Machine-Readable AST Harvester Flowchart",
  className,
  ...props
}: FlowchartProcessGraphProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Flowchart: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Linear node pipeline graph with step-by-step conditional branch and compilation points.
        </p>
      </header>

      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 680 140"
          className="w-full min-w-[620px] h-auto overflow-visible"
          role="img"
          aria-label="Process flowchart diagram"
        >
          {/* Paths */}
          <line x1="120" y1="70" x2="160" y2="70" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/50" />
          <line x1="280" y1="70" x2="320" y2="70" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/50" />
          <line x1="440" y1="70" x2="480" y2="70" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/50" />

          {/* Step 1 */}
          <g transform="translate(10, 40)">
            <rect width="110" height="60" rx="8" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="55" y="28" textAnchor="middle" className="fill-foreground text-[10px] font-bold">1. Ingest JSON</text>
            <text x="55" y="44" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">Fetch Source</text>
          </g>

          {/* Step 2 */}
          <g transform="translate(160, 40)">
            <rect width="120" height="60" rx="8" fill="currentColor" className="text-primary/10 stroke-primary/50 stroke-1" />
            <text x="60" y="28" textAnchor="middle" className="fill-primary text-[10px] font-bold">2. AST Codemod</text>
            <text x="60" y="44" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">Tailwind v4 First</text>
          </g>

          {/* Step 3 */}
          <g transform="translate(320, 40)">
            <rect width="120" height="60" rx="8" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="60" y="28" textAnchor="middle" className="fill-foreground text-[10px] font-bold">3. Slop Review</text>
            <text x="60" y="44" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">30 Quality Rules</text>
          </g>

          {/* Step 4 */}
          <g transform="translate(480, 40)">
            <rect width="130" height="60" rx="8" fill="currentColor" className="text-emerald-500/10 stroke-emerald-500/50 stroke-1" />
            <text x="65" y="28" textAnchor="middle" className="fill-emerald-600 dark:text-emerald-400 text-[10px] font-bold">4. Registry Emit</text>
            <text x="65" y="44" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">15KB Context JSON</text>
          </g>
        </svg>
      </div>
    </figure>
  );
}
