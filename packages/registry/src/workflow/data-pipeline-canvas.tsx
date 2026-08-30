/**
 * @license MIT
 * @origin XY Flow (https://github.com/xyflow/xyflow)
 * @author XY Flow & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Database, ArrowRight, Activity, HardDrive, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PipelineStage {
  id: string;
  name: string;
  type: "source" | "transformer" | "sink";
  throughput: string;
  latencyMs: number;
}

export interface DataPipelineCanvasProps {
  stages?: PipelineStage[];
  className?: string;
}

const DEFAULT_STAGES: PipelineStage[] = [
  { id: "s1", name: "DTCG Token Store", type: "source", throughput: "1.2 MB/s", latencyMs: 4 },
  { id: "s2", name: "AST Codemod Engine", type: "transformer", throughput: "850 KB/s", latencyMs: 18 },
  { id: "s3", name: "Axe A11y Validator", type: "transformer", throughput: "420 KB/s", latencyMs: 32 },
  { id: "s4", name: "Registry Distribution", type: "sink", throughput: "1.2 MB/s", latencyMs: 2 },
];

export function DataPipelineCanvas({
  stages = DEFAULT_STAGES,
  className,
}: DataPipelineCanvasProps) {
  const [activeStageId, setActiveStageId] = useState<string>("s2");
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-foreground overflow-hidden shadow-sm",
        className
      )}
      role="region"
      aria-label="Real-time Streaming Data Pipeline Canvas"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-mono font-medium tracking-tight">
            STREAMING_PIPELINE // HARVEST_INGEST
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">REAL-TIME TELEMETRY</span>
      </div>

      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === activeStageId;
          const StageIcon =
            stage.type === "source"
              ? HardDrive
              : stage.type === "sink"
              ? Database
              : Cpu;

          return (
            <React.Fragment key={stage.id}>
              <motion.div
                onClick={() => setActiveStageId(stage.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveStageId(stage.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Pipeline Stage: ${stage.name}, throughput ${stage.throughput}`}
                className={cn(
                  "flex flex-col min-w-[170px] rounded-lg border p-3.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background hover:bg-muted/40"
                )}
                initial={false}
                animate={shouldReduceMotion ? {} : { scale: isSelected ? 1.02 : 1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    {stage.type}
                  </span>
                  <StageIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </div>
                <h4 className="mt-2 text-xs font-semibold">{stage.name}</h4>
                <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] font-mono text-muted-foreground">
                  <span>{stage.throughput}</span>
                  <span>{stage.latencyMs}ms</span>
                </div>
              </motion.div>

              {idx < stages.length - 1 && (
                <div className="hidden md:flex items-center text-muted-foreground" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
