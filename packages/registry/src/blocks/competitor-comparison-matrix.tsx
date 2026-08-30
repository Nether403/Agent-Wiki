/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Check, X, Sparkles } from "lucide-react";

export interface ComparisonRow {
  feature: string;
  agentWiki: boolean | string;
  genericLlms: boolean | string;
  traditionalUi: boolean | string;
}

export interface CompetitorComparisonMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  rows?: ComparisonRow[];
}

const DEFAULT_ROWS: ComparisonRow[] = [
  { feature: "Sub-15KB MCP Delivery", agentWiki: true, genericLlms: false, traditionalUi: false },
  { feature: "30 Anti-Slop AST Rules", agentWiki: true, genericLlms: false, traditionalUi: false },
  { feature: "100% WCAG 2.1 AA A11y", agentWiki: true, genericLlms: "Uncertain", traditionalUi: true },
  { feature: "1-10 Calibrated Taste Dials", agentWiki: true, genericLlms: false, traditionalUi: false },
  { feature: "Tripwire Prompt Injection Sandbox", agentWiki: true, genericLlms: false, traditionalUi: false },
  { feature: "Multi-Agent Sync (11 IDEs)", agentWiki: true, genericLlms: false, traditionalUi: false },
];

export function CompetitorComparisonMatrix({
  title = "Architecture & Capability Comparison",
  rows = DEFAULT_ROWS,
  className,
  ...props
}: CompetitorComparisonMatrixProps) {
  return (
    <section
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6 text-card-foreground",
        className
      )}
      aria-label={title}
      {...props}
    >
      <header className="border-b border-border pb-4">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Deterministic capabilities vs. generic LLM code generation and legacy component packages.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse" role="grid">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="py-3 px-4 font-semibold">Capability</th>
              <th scope="col" className="py-3 px-4 font-bold text-primary bg-primary/5 rounded-t-lg">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Agent Wiki</span>
                </div>
              </th>
              <th scope="col" className="py-3 px-4 font-medium">Generic LLM Prompts</th>
              <th scope="col" className="py-3 px-4 font-medium">Standard UI Kits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row) => (
              <tr key={row.feature} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{row.feature}</td>
                <td className="py-3 px-4 bg-primary/5 font-semibold text-primary">
                  {typeof row.agentWiki === "boolean" ? (
                    row.agentWiki ? (
                      <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" aria-hidden="true" />
                    )
                  ) : (
                    <span>{row.agentWiki}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {typeof row.genericLlms === "boolean" ? (
                    row.genericLlms ? (
                      <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" aria-hidden="true" />
                    )
                  ) : (
                    <span>{row.genericLlms}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {typeof row.traditionalUi === "boolean" ? (
                    row.traditionalUi ? (
                      <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" aria-hidden="true" />
                    )
                  ) : (
                    <span>{row.traditionalUi}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
