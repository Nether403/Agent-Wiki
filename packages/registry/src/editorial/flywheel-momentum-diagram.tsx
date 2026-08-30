/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, RotateCw, Sparkles, TrendingUp, Zap } from "lucide-react";

export interface FlywheelStage {
  id: string;
  label: string;
  subtext: string;
  metric?: string;
}

export interface FlywheelMomentumDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  stages?: FlywheelStage[];
  coreLabel?: string;
}

const DEFAULT_STAGES: FlywheelStage[] = [
  { id: "s1", label: "Agent Discovery", subtext: "Zero-latency MCP tools find deterministic primitives", metric: "+4.2x" },
  { id: "s2", label: "Zero-Slop Assembly", subtext: "Strict AST constraints prevent token hallucination", metric: "0 slop" },
  { id: "s3", label: "Automated QA Gate", subtext: "WCAG AA, axe-core, and taste dials verify quality", metric: "100/100" },
  { id: "s4", label: "Compounding Velocity", subtext: "Tested building blocks accelerate release cycles", metric: ">90% 1st-pass" },
];

export function FlywheelMomentumDiagram({
  title = "Flywheel Momentum Engine",
  subtitle = "Self-reinforcing feedback loop that compounds velocity and eliminates AI slop.",
  stages = DEFAULT_STAGES,
  coreLabel = "MOMENTUM CORE",
  className,
  ...props
}: FlywheelMomentumDiagramProps) {
  const [activeStage, setActiveStage] = React.useState<number | null>(null);

  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Flywheel Momentum Diagram: ${title}`}
      {...props}
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "12s" }} aria-hidden="true" />
            <h3 className="text-sm font-bold tracking-tight text-foreground">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Compounding Loop
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Circular Flywheel Canvas */}
        <div className="lg:col-span-6 flex justify-center py-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full"
              role="img"
              aria-label="Flywheel stage visualization with 4 continuous quadrant vectors"
            >
              {/* Outer track */}
              <circle
                cx="160"
                cy="160"
                r="130"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-border"
                strokeDasharray="4 4"
              />

              {/* 4 Quadrant Arcs */}
              {[
                { d: "M 160 30 A 130 130 0 0 1 290 160", index: 0 },
                { d: "M 290 160 A 130 130 0 0 1 160 290", index: 1 },
                { d: "M 160 290 A 130 130 0 0 1 30 160", index: 2 },
                { d: "M 30 160 A 130 130 0 0 1 160 30", index: 3 },
              ].map((arc) => (
                <path
                  key={arc.index}
                  d={arc.d}
                  fill="none"
                  strokeWidth={activeStage === arc.index ? "3.5" : "2"}
                  className={cn(
                    "transition-all duration-200 cursor-pointer",
                    activeStage === arc.index
                      ? "stroke-primary"
                      : "stroke-muted-foreground/40 hover:stroke-muted-foreground"
                  )}
                  onMouseEnter={() => setActiveStage(arc.index)}
                  onMouseLeave={() => setActiveStage(null)}
                />
              ))}

              {/* Center Core Circle */}
              <circle
                cx="160"
                cy="160"
                r="56"
                className="fill-card stroke-border"
                strokeWidth="2"
              />
              <circle
                cx="160"
                cy="160"
                r="48"
                className="fill-muted/40 stroke-border/50"
                strokeWidth="1"
              />

              {/* Center Text */}
              <text
                x="160"
                y="156"
                textAnchor="middle"
                className="text-[10px] font-mono uppercase tracking-widest font-semibold fill-foreground"
              >
                {coreLabel}
              </text>
              <text
                x="160"
                y="172"
                textAnchor="middle"
                className="text-[9px] font-mono fill-muted-foreground"
              >
                Zero-Slop
              </text>
            </svg>
          </div>
        </div>

        {/* Interactive Stage Cards */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onMouseEnter={() => setActiveStage(idx)}
                onMouseLeave={() => setActiveStage(null)}
                onFocus={() => setActiveStage(idx)}
                onBlur={() => setActiveStage(null)}
                className={cn(
                  "flex items-start justify-between rounded-lg border p-3.5 transition-colors duration-200 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-primary bg-accent/40"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold transition-colors duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">{stage.label}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {stage.subtext}
                    </p>
                  </div>
                </div>
                {stage.metric && (
                  <span className="shrink-0 font-mono text-xs font-semibold text-primary px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20">
                    {stage.metric}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-6 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          Autonomous compounding feedback loop
        </span>
        <span>4-Phase Continuous Cycle</span>
      </footer>
    </figure>
  );
}
