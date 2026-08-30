/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, ChevronRight, Layers, ShieldCheck } from "lucide-react";

export interface ValueChainStage {
  id: string;
  name: string;
  category: "primary" | "support";
  activities: string[];
  marginImpact: string;
}

export interface ValueChainMapProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  stages?: ValueChainStage[];
}

const DEFAULT_STAGES: ValueChainStage[] = [
  {
    id: "inbound",
    name: "Inbound Sourcing",
    category: "primary",
    activities: ["Remote repo scanning", "License verification", "Shallow git harvesting"],
    marginImpact: "Zero legal risk",
  },
  {
    id: "operations",
    name: "AST Normalization",
    category: "primary",
    activities: ["Tailwind v4 tokens", "React 19 forwardRef removal", "motion/react codemods"],
    marginImpact: "100% compilation",
  },
  {
    id: "outbound",
    name: "Registry Distribution",
    category: "primary",
    activities: ["Static /r/ endpoints", "Context-budget flat files", "Cloudflare edge worker"],
    marginImpact: "<15KB payloads",
  },
  {
    id: "marketing",
    name: "Agent Orchestration",
    category: "primary",
    activities: ["MCP JSON-RPC tools", "11 platform rulepacks", "DTCG token binding"],
    marginImpact: "Zero hallucination",
  },
  {
    id: "service",
    name: "Continuous Quality QA",
    category: "primary",
    activities: ["axe-core WCAG AA", "Anti-slop AST linter", "Taste dial profiling"],
    marginImpact: "Flawless S-Grade",
  },
];

export function ValueChainMap({
  title = "Strategic Value Chain Architecture",
  subtitle = "Porter's value chain model adapted for machine-first UI component ingestion, compilation, and agent delivery.",
  stages = DEFAULT_STAGES,
  className,
  ...props
}: ValueChainMapProps) {
  const [activeStage, setActiveStage] = React.useState<string>(stages[0]?.id ?? "inbound");
  const selected = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Strategic Value Chain Map: ${title}`}
      {...props}
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3 className="text-sm font-bold tracking-tight text-foreground">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-mono text-muted-foreground self-start sm:self-auto">
          Operational Flow
        </span>
      </header>

      {/* Process Chevron Track */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
        {stages.map((stage, idx) => {
          const isActive = stage.id === activeStage;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "group relative flex flex-col p-3 rounded-lg border text-left transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary bg-primary/10 shadow-xs"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                  Step 0{idx + 1}
                </span>
                {isActive && <ShieldCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />}
              </div>
              <span className="text-xs font-semibold text-foreground line-clamp-1">{stage.name}</span>
              <span className="text-[11px] font-mono text-primary mt-1">{stage.marginImpact}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Breakdown */}
      <div className="rounded-lg border border-border bg-muted/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
              Active Stage Ingestion
            </span>
            <h4 className="text-sm font-bold text-foreground mt-0.5">{selected.name}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">Quality Multiplier:</span>
            <span className="font-mono text-xs font-bold text-foreground bg-card px-2.5 py-1 rounded-sm border border-border">
              {selected.marginImpact}
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-foreground">Executed Workflows & Guardrails:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2.5">
            {selected.activities.map((act, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                <span className="truncate">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
