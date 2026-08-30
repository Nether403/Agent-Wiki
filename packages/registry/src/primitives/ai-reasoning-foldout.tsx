/**
 * @license MIT
 * @origin Hallmark / 21st.dev (https://21st.dev)
 * @author Hallmark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronDown, Brain, CheckCircle2, Clock, Terminal } from "lucide-react";

export interface ReasoningStep {
  title: string;
  durationMs?: number;
  status?: "done" | "in_progress" | "pending";
  detail?: string;
}

export interface AiReasoningFoldoutProps extends React.HTMLAttributes<HTMLDivElement> {
  thoughtDurationSeconds?: number;
  steps?: ReasoningStep[];
  rawThinkingText?: string;
  defaultOpen?: boolean;
}

export function AiReasoningFoldout({
  thoughtDurationSeconds = 3.2,
  steps = [
    { title: "Querying MCP registry search_components", durationMs: 420, status: "done" },
    { title: "Validating against 30 Anti-Slop Rules", durationMs: 780, status: "done" },
    { title: "Calibrating Taste Dials (Variance: 5, Motion: 4)", durationMs: 310, status: "done" },
    { title: "Emitting verified TypeScript React source", durationMs: 1690, status: "done" },
  ],
  rawThinkingText,
  defaultOpen = false,
  className,
  ...props
}: AiReasoningFoldoutProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border/80 bg-muted/20 text-foreground overflow-hidden transition-colors shadow-xs",
        className
      )}
      {...props}
    >
      {/* Header Button Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) {
            setIsOpen(false);
          }
        }}
        className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-label={`Toggle AI reasoning steps (${thoughtDurationSeconds}s elapsed)`}
      >
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
          <span className="font-semibold text-foreground">Thought for {thoughtDurationSeconds.toFixed(1)} seconds</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
            {steps.length} steps
          </span>
        </div>

        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {/* Foldout Drawer Body */}
      {isOpen && (
        <div className="flex flex-col px-4 pb-4 pt-1 space-y-3 border-t border-border/40 text-xs text-muted-foreground animate-in fade-in-50 duration-200">
          {/* Step sequence */}
          <div className="flex flex-col space-y-2 mt-2">
            {steps.map((step, idx) => (
              <div key={`${step.title}-${idx}`} className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {step.status === "done" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{step.title}</span>
                    {step.durationMs && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>
                  {step.detail && <p className="text-[11px] text-muted-foreground mt-0.5">{step.detail}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Raw reasoning text */}
          {rawThinkingText && (
            <div className="mt-3 p-3 rounded-lg bg-card border border-border text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
              <div className="flex items-center gap-1.5 mb-1.5 font-semibold text-foreground">
                <Terminal className="h-3 w-3 text-primary" aria-hidden="true" />
                <span>Internal Cognitive Log</span>
              </div>
              {rawThinkingText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
