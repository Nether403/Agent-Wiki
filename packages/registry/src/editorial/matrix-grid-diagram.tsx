/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface MatrixCell {
  title: string;
  subtitle: string;
  tag?: string;
  highlight?: boolean;
}

export interface MatrixGridDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  gridCells?: MatrixCell[];
}

const DEFAULT_CELLS: MatrixCell[] = [
  { title: "Primitives", subtitle: "Buttons, Inputs, Dialogs", tag: "Base" },
  { title: "Motion Physics", subtitle: "Morphs, Docks, Springs", tag: "Tier 2" },
  { title: "Creative 3D", subtitle: "WebGL, Canvas, Shaders", tag: "Tier 3" },
  { title: "Editorial SVGs", subtitle: "39 Clean Diagrams", tag: "Design" },
  { title: "AI-Native", subtitle: "Thought DAGs, Artifacts", tag: "Core", highlight: true },
  { title: "Media Timelines", subtitle: "Remocn video scrubbers", tag: "Media" },
  { title: "Blocks", subtitle: "Asymmetric SaaS sections", tag: "Layout" },
  { title: "Governance", subtitle: "30 Anti-Slop Rules", tag: "Quality", highlight: true },
  { title: "Ecosystem", subtitle: "11 Agent IDE Configs", tag: "Scale" },
];

export function MatrixGridDiagram({
  title = "3x3 Architectural Domain Matrix",
  gridCells = DEFAULT_CELLS,
  className,
  ...props
}: MatrixGridDiagramProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Matrix Grid: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Structured 3x3 taxonomy breakdown covering foundational, creative, and governance capabilities.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {gridCells.map((cell) => (
          <div
            key={cell.title}
            className={cn(
              "flex flex-col p-4 rounded-xl border transition-colors space-y-1.5",
              cell.highlight
                ? "border-primary/50 bg-primary/5 shadow-xs"
                : "border-border bg-muted/20 hover:border-primary/30"
            )}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground">{cell.title}</h4>
              {cell.tag && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                  {cell.tag}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{cell.subtitle}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
