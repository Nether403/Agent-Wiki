/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { AlertCircle, Eye, HelpCircle, Layers } from "lucide-react";

export interface IcebergLevel {
  id: string;
  depth: "surface" | "shallow" | "deep";
  percentage: string;
  title: string;
  items: string[];
}

export interface IcebergDepthDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  levels?: IcebergLevel[];
}

const DEFAULT_LEVELS: IcebergLevel[] = [
  {
    id: "surface",
    depth: "surface",
    percentage: "10%",
    title: "Surface Symptoms (Visible Slop)",
    items: [
      "Indigo-600 buttons & purple-to-blue linear gradients",
      "Decorative emojis inside card headers and lists",
      "Arbitrary pixel hacks and non-token margin overrides",
      "Blanket glassmorphism blur without borders",
    ],
  },
  {
    id: "shallow",
    depth: "shallow",
    percentage: "35%",
    title: "Structural Defects (Below the Waterline)",
    items: [
      "Chained type casting bypassing compiler safety",
      "Unlabeled icon buttons breaking screen readers",
      "Suppressed focus rings and focus outline stripping",
      "Missing reduced-motion checks on canvas loops",
    ],
  },
  {
    id: "deep",
    depth: "deep",
    percentage: "55%",
    title: "Systemic Root Causes (Cognitive Architecture)",
    items: [
      "Agent forced to reinvent UI it cannot visually see",
      "Absence of deterministic component registry in context",
      "Uncalibrated taste dials producing generic averages",
      "Lack of automated AST quality gates before commit",
    ],
  },
];

export function IcebergDepthDiagram({
  title = "Iceberg Depth Analysis: Root Causes of AI Slop",
  subtitle = "Visualizing the 10% visible symptoms versus the 90% submerged architectural flaws in AI frontend development.",
  levels = DEFAULT_LEVELS,
  className,
  ...props
}: IcebergDepthDiagramProps) {
  const [activeLevel, setActiveLevel] = React.useState<string>("deep");

  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Iceberg Depth Diagram: ${title}`}
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
          Depth Analysis
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Iceberg Elevation Graphic */}
        <div className="lg:col-span-6 flex justify-center py-2">
          <div className="relative w-full max-w-sm h-72 sm:h-80">
            <svg
              viewBox="0 0 340 320"
              className="w-full h-full"
              role="img"
              aria-label="Iceberg diagram representing surface symptoms vs submerged systemic causes"
            >
              {/* Waterline */}
              <line
                x1="20"
                y1="85"
                x2="320"
                y2="85"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="text-primary"
              />
              <text
                x="315"
                y="78"
                textAnchor="end"
                className="text-[10px] font-mono font-bold fill-primary uppercase tracking-wider"
              >
                Waterline (Visible / Submerged)
              </text>

              {/* Iceberg Tip (Surface) */}
              <polygon
                points="170,25 215,85 125,85"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  activeLevel === "surface"
                    ? "fill-primary/30 stroke-primary stroke-2"
                    : "fill-primary/10 stroke-border hover:stroke-muted-foreground stroke-1"
                )}
                onClick={() => setActiveLevel("surface")}
                tabIndex={0}
                role="button"
                aria-label="Surface Level"
              />
              <text
                x="170"
                y="65"
                textAnchor="middle"
                className="pointer-events-none text-[10px] font-mono font-bold fill-foreground"
              >
                10% VISIBLE
              </text>

              {/* Submerged Tier 1 (Shallow) */}
              <polygon
                points="125,87 215,87 255,185 85,185"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  activeLevel === "shallow"
                    ? "fill-primary/25 stroke-primary stroke-2"
                    : "fill-muted/40 stroke-border hover:stroke-muted-foreground stroke-1"
                )}
                onClick={() => setActiveLevel("shallow")}
                tabIndex={0}
                role="button"
                aria-label="Shallow Level"
              />
              <text
                x="170"
                y="140"
                textAnchor="middle"
                className="pointer-events-none text-[11px] font-mono font-bold fill-foreground"
              >
                35% STRUCTURAL DEFECTS
              </text>

              {/* Submerged Tier 2 (Deep Foundation) */}
              <polygon
                points="85,187 255,187 210,295 130,295"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  activeLevel === "deep"
                    ? "fill-primary/40 stroke-primary stroke-2"
                    : "fill-muted/70 stroke-border hover:stroke-muted-foreground stroke-1"
                )}
                onClick={() => setActiveLevel("deep")}
                tabIndex={0}
                role="button"
                aria-label="Deep Foundation Level"
              />
              <text
                x="170"
                y="245"
                textAnchor="middle"
                className="pointer-events-none text-[11px] font-mono font-bold fill-foreground"
              >
                55% SYSTEMIC ROOTS
              </text>
            </svg>
          </div>
        </div>

        {/* Level Breakdown Cards */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {levels.map((lvl) => {
            const isActive = activeLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveLevel(lvl.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveLevel(lvl.id);
                }}
                className={cn(
                  "flex flex-col p-4 rounded-lg border text-left transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {lvl.depth === "surface" ? (
                      <Eye className="w-4 h-4 text-primary" aria-hidden="true" />
                    ) : lvl.depth === "shallow" ? (
                      <AlertCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                    )}
                    <h4 className="text-xs font-bold text-foreground">{lvl.title}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-sm bg-primary/15 border border-primary/20">
                    {lvl.percentage}
                  </span>
                </div>

                <ul className="space-y-1 mt-1">
                  {lvl.items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
