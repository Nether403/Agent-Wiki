/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { GitBranch, Check, X } from "lucide-react";

export interface DecisionTreeNodeGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function DecisionTreeNodeGraph({
  title = "Agent Decision Matrix & Routing Tree",
  className,
  ...props
}: DecisionTreeNodeGraphProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Decision Tree Diagram: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Deterministic logic branches resolving user intent to registry components or code generation.
        </p>
      </header>

      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 700 240"
          className="w-full sm:min-w-[640px] min-w-full h-auto overflow-visible"
          role="img"
          aria-label="Branching decision tree diagram"
        >
          {/* Connector Paths */}
          <path
            d="M 140 120 L 230 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/60"
          />
          <path
            d="M 330 120 C 370 120, 370 50, 420 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-emerald-500/70"
          />
          <path
            d="M 330 120 C 370 120, 370 190, 420 190"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-destructive/70"
          />
          <path
            d="M 540 50 L 590 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-emerald-500/70"
          />
          <path
            d="M 540 190 L 590 190"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-destructive/70"
          />

          {/* Root Node: Prompt Arrives */}
          <g transform="translate(10, 85)">
            <rect
              width="130"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-muted/30 stroke-border stroke-1"
            />
            <text x="65" y="32" textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              User Prompt
            </text>
            <text x="65" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Input Intent
            </text>
          </g>

          {/* Decision Node: Check Registry */}
          <g transform="translate(230, 80)">
            <polygon
              points="50,0 100,40 50,80 0,40"
              fill="currentColor"
              className="text-primary/10 stroke-primary/50 stroke-1"
            />
            <text x="50" y="38" textAnchor="middle" className="fill-primary text-[10px] font-bold">
              Registry Match?
            </text>
            <text x="50" y="50" textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
              search_library
            </text>
          </g>

          {/* Branch True: Install Recipe */}
          <g transform="translate(420, 15)">
            <rect
              width="120"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-emerald-500/10 stroke-emerald-500/40 stroke-1"
            />
            <text x="60" y="30" textAnchor="middle" className="fill-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              npx design-wiki add
            </text>
            <text x="60" y="48" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Pre-tested Zero Slop
            </text>
          </g>

          {/* Terminal True: Deliver UI */}
          <g transform="translate(590, 25)">
            <circle cx="25" cy="25" r="25" fill="currentColor" className="text-emerald-500/20 stroke-emerald-500 stroke-1" />
            <text x="25" y="30" textAnchor="middle" className="fill-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              DONE
            </text>
          </g>

          {/* Branch False: Harvester & AST Linter */}
          <g transform="translate(420, 155)">
            <rect
              width="120"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-destructive/10 stroke-destructive/40 stroke-1"
            />
            <text x="60" y="30" textAnchor="middle" className="fill-destructive text-[11px] font-bold">
              Codegen + Audit
            </text>
            <text x="60" y="48" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Run 30 Slop Rules
            </text>
          </g>

          {/* Terminal False: Unslop Refactor */}
          <g transform="translate(590, 165)">
            <circle cx="25" cy="25" r="25" fill="currentColor" className="text-destructive/20 stroke-destructive stroke-1" />
            <text x="25" y="30" textAnchor="middle" className="fill-destructive text-[10px] font-bold">
              UNSLOP
            </text>
          </g>
        </svg>
      </div>

      <footer className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Match: Direct Registry Ingestion
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
            Mismatch: Anti-Slop Audit Pipeline
          </span>
        </div>
      </footer>
    </figure>
  );
}
