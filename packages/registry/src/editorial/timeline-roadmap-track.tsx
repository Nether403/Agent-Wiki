/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Check, Clock, Sparkles } from "lucide-react";

export interface RoadmapMilestone {
  id: string;
  quarter: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  badge?: string;
}

export interface TimelineRoadmapTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  milestones?: RoadmapMilestone[];
}

const DEFAULT_MILESTONES: RoadmapMilestone[] = [
  {
    id: "m1",
    quarter: "Phase 1",
    title: "AI-Native & Editorial Diagrams",
    description: "Ingest prompt inputs, message threads, artifact canvas, and 39 SVG diagram blueprints.",
    status: "completed",
    badge: "55 Items",
  },
  {
    id: "m2",
    quarter: "Phase 2",
    title: "Motion & Enterprise Primitives",
    description: "Ingest morphing dialogs, sliding numbers, ReUI data grid, and 638 animated icons.",
    status: "completed",
    badge: "70 Items",
  },
  {
    id: "m3",
    quarter: "Phase 3",
    title: "3D WebGL, Shaders & Media",
    description: "Ingest ThreeUI viewports, matrix rain, dot-matrix tickers, and Remocn scrubbers.",
    status: "completed",
    badge: "85 Items",
  },
  {
    id: "m4",
    quarter: "Phase 4",
    title: "Anti-Slop 2.0 & Unslop CLI",
    description: "Expand to 30 Anti-Slop Rules, launch Unslop auto-themer, and deploy Tripwire sandbox.",
    status: "current",
    badge: "100+ Target",
  },
];

export function TimelineRoadmapTrack({
  title = "Agent Wiki Product & Ingestion Roadmap",
  milestones = DEFAULT_MILESTONES,
  className,
  ...props
}: TimelineRoadmapTrackProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Milestone Roadmap: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sequential phase progression tracker with completed, active, and scheduled deliverables.
          </p>
        </div>
      </header>

      {/* Horizontal step tracker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {milestones.map((m, idx) => {
          const isCompleted = m.status === "completed";
          const isCurrent = m.status === "current";

          return (
            <article
              key={m.id}
              className={cn(
                "flex flex-col p-4 rounded-xl border transition-colors relative space-y-2",
                isCurrent && "border-primary bg-primary/5 shadow-xs",
                isCompleted && "border-border bg-muted/20",
                !isCurrent && !isCompleted && "border-border/60 bg-muted/10 opacity-70"
              )}
              aria-label={`Milestone ${m.quarter}: ${m.title}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase">
                  {m.quarter}
                </span>

                <div
                  className={cn(
                    "flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold",
                    isCompleted && "bg-emerald-500 text-white",
                    isCurrent && "bg-primary text-primary-foreground animate-pulse",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground border border-border"
                  )}
                  aria-hidden="true"
                >
                  {isCompleted && <Check className="h-3 w-3" />}
                  {isCurrent && <Sparkles className="h-3 w-3" />}
                  {!isCompleted && !isCurrent && <Clock className="h-3 w-3" />}
                </div>
              </div>

              <h4 className="text-xs font-bold text-foreground leading-snug">{m.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">{m.description}</p>

              {m.badge && (
                <div className="pt-2 border-t border-border/40">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-foreground font-semibold">
                    {m.badge}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </figure>
  );
}
