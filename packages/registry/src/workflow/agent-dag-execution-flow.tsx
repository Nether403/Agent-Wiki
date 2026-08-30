/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle, Clock, ArrowRight, Play, RefreshCw } from "lucide-react";

export type DAGStepStatus = "idle" | "running" | "completed" | "error";

export interface DAGStepNode {
  id: string;
  name: string;
  role: string;
  durationMs?: number;
  status: DAGStepStatus;
  outputSummary?: string;
  dependencies: string[];
}

export interface AgentDAGExecutionFlowProps {
  nodes?: DAGStepNode[];
  pipelineName?: string;
  className?: string;
}

export function AgentDAGExecutionFlow({
  nodes = [
    { id: "1", name: "1. Intent Classifier", role: "Router Agent", durationMs: 240, status: "completed", outputSummary: "Query classified as ui:motion", dependencies: [] },
    { id: "2", name: "2. AST Dependency Parser", role: "Harvester Agent", durationMs: 480, status: "completed", outputSummary: "Found motion/react & lucide-react", dependencies: ["1"] },
    { id: "3", name: "3. Slop & A11y Gate", role: "Audit Linter", durationMs: 310, status: "running", outputSummary: "Evaluating SLOP-001..SLOP-050", dependencies: ["2"] },
    { id: "4", name: "4. Registry Compiler", role: "Builder Agent", status: "idle", outputSummary: "Waiting for QA certification", dependencies: ["3"] },
  ],
  pipelineName = "Autonomous UI Component Ingestion Pipeline",
  className = "",
}: AgentDAGExecutionFlowProps) {
  const [pipelineNodes, setPipelineNodes] = useState<DAGStepNode[]>(nodes);
  const [activeStepId, setActiveStepId] = useState<string>("3");

  const activeNode = pipelineNodes.find((n) => n.id === activeStepId);

  const getStatusBadge = (status: DAGStepStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" role="img" aria-hidden="true" />
            PASS
          </span>
        );
      case "running":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" role="img" aria-hidden="true" />
            ACTIVE
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" role="img" aria-hidden="true" />
            FAIL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5" role="img" aria-hidden="true" />
            IDLE
          </span>
        );
    }
  };

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm " + className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div>
          <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">Multi-Agent DAG</span>
          <h3 className="text-base font-semibold text-foreground tracking-tight">{pipelineName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setPipelineNodes((prev) =>
                prev.map((n) => ({ ...n, status: n.id === "1" ? "running" : "idle" }))
              );
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Restart DAG Pipeline"
          >
            <RefreshCw className="w-3.5 h-3.5" role="img" aria-hidden="true" />
            Restart
          </button>
        </div>
      </div>

      {/* DAG Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-5">
        {pipelineNodes.map((node, index) => {
          const isSelected = node.id === activeStepId;
          return (
            <div
              key={node.id}
              onClick={() => setActiveStepId(node.id)}
              className={
                "relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between " +
                (isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background/50 hover:border-muted-foreground/30")
              }
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{node.role}</span>
                  {getStatusBadge(node.status)}
                </div>
                <h4 className="text-sm font-medium text-foreground">{node.name}</h4>
              </div>

              {node.durationMs && (
                <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Latency</span>
                  <span>{node.durationMs}ms</span>
                </div>
              )}

              {/* Connector Arrow */}
              {index < pipelineNodes.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-card border border-border text-muted-foreground">
                  <ArrowRight className="w-3 h-3" role="img" aria-hidden="true" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Node Inspector */}
      {activeNode && (
        <div className="p-4 rounded-lg bg-muted/40 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted-foreground">STEP INSPECTOR // {activeNode.name}</span>
            <span className="text-xs font-mono text-muted-foreground">{activeNode.role}</span>
          </div>
          <div className="text-sm font-mono text-foreground bg-background p-3 rounded-md border border-border/60">
            {activeNode.outputSummary || "No output telemetry available for this step."}
          </div>
        </div>
      )}
    </div>
  );
}
