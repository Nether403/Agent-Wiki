/**
 * @license MIT
 * @origin Cult UI (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronDown, Brain, CheckCircle2, Clock, Terminal, AlertCircle, Loader2 } from "lucide-react";

export interface ReasoningStepItem {
  id?: string;
  title: string;
  durationMs?: number;
  status: "done" | "in_progress" | "failed" | "pending";
  detail?: string;
  toolCall?: {
    toolName: string;
    params?: Record<string, unknown>;
  };
}

export interface AiReasoningAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  thoughtDurationSeconds?: number;
  steps?: ReasoningStepItem[];
  defaultOpen?: boolean;
  isStreaming?: boolean;
}

export function AiReasoningAccordion({
  thoughtDurationSeconds = 2.4,
  steps = [
    { id: "1", title: "Analyzing design tokens and taste dials", durationMs: 320, status: "done" },
    { id: "2", title: "Querying MCP registry component definitions", durationMs: 480, status: "done" },
    { id: "3", title: "Synthesizing zero-slop TypeScript source", durationMs: 1200, status: "done" },
  ],
  defaultOpen = false,
  isStreaming = false,
  className,
  ...props
}: AiReasoningAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [selectedStepId, setSelectedStepId] = React.useState<string | null>(null);

  const completedCount = steps.filter((s) => s.status === "done").length;

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-muted/20 text-card-foreground overflow-hidden transition-colors shadow-xs",
        className
      )}
      role="region"
      aria-label="AI Chain of Thought Reasoning Accordion"
      {...props}
    >
      {/* Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) {
            setIsOpen(false);
          }
        }}
        aria-expanded={isOpen}
        aria-controls="reasoning-accordion-content"
        className="flex items-center justify-between w-full px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-2">
          <Brain
            className={cn("h-4 w-4 text-primary", isStreaming && "animate-pulse")}
            aria-hidden="true"
          />
          <span className="font-semibold text-foreground">
            {isStreaming ? "Reasoning in progress..." : `Thought for ${thoughtDurationSeconds.toFixed(1)}s`}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono">
            {completedCount}/{steps.length} steps
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Collapsible Steps Content */}
      {isOpen && (
        <div
          id="reasoning-accordion-content"
          className="flex flex-col space-y-2 p-4 border-t border-border/40 bg-card/50"
        >
          {steps.map((step, idx) => {
            const isStepSelected = selectedStepId === (step.id || String(idx));
            return (
              <div
                key={step.id || idx}
                className={cn(
                  "flex flex-col rounded-xl border border-border/60 bg-card p-3 transition-colors",
                  isStepSelected && "ring-1 ring-primary/40 border-primary/40"
                )}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setSelectedStepId(isStepSelected ? null : step.id || String(idx))
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {step.status === "done" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                    ) : step.status === "in_progress" ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" aria-hidden="true" />
                    ) : step.status === "failed" ? (
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0" aria-hidden="true" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                    )}
                    <span className="text-xs font-medium text-foreground">{step.title}</span>
                  </div>

                  {step.durationMs !== undefined && (
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {step.durationMs}ms
                    </span>
                  )}
                </div>

                {/* Optional Step Detail / Tool Call */}
                {(step.detail || step.toolCall) && isStepSelected && (
                  <div className="mt-2.5 pt-2 border-t border-border/40 text-xs text-muted-foreground space-y-1.5 font-mono">
                    {step.detail && <p className="whitespace-pre-wrap">{step.detail}</p>}
                    {step.toolCall && (
                      <div className="p-2 rounded-lg bg-muted/40 border border-border text-xs">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <Terminal className="h-3 w-3" aria-hidden="true" />
                          <span>Tool: {step.toolCall.toolName}</span>
                        </div>
                        {step.toolCall.params && (
                          <pre className="mt-1 text-xs text-foreground overflow-x-auto">
                            {JSON.stringify(step.toolCall.params, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
