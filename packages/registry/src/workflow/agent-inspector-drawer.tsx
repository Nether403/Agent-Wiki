/**
 * @origin Machine-First Design Agent Wiki
 * @license MIT
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Cpu, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export interface AgentStepExecution {
  id: string;
  tool: string;
  status: "success" | "running" | "failed";
  elapsedMs: number;
  input: Record<string, unknown>;
  output?: Record<string, unknown> | string;
}

export interface AgentInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  execution?: AgentStepExecution;
  className?: string;
}

export function AgentInspectorDrawer({
  isOpen,
  onClose,
  execution,
  className,
}: AgentInspectorDrawerProps) {
  // Handle escape key listener with cleanup
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className={cn(
              "relative z-50 h-full w-full max-w-md border-l border-border bg-card p-6 shadow-2xl overflow-y-auto",
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 id="drawer-title" className="text-lg font-semibold text-foreground">
                  Step Inspector
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Inspector"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {execution ? (
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {execution.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    ) : execution.status === "failed" ? (
                      <AlertCircle className="h-4 w-4 text-rose-500" aria-hidden="true" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500 animate-spin" aria-hidden="true" />
                    )}
                    <span className="capitalize">{execution.status}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {execution.elapsedMs}ms
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Executed Tool
                  </h3>
                  <code className="block rounded-lg bg-background p-2 font-mono text-sm border border-border">
                    {execution.tool}
                  </code>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Input Parameters
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-muted-foreground border border-border max-h-48">
                    {JSON.stringify(execution.input, null, 2)}
                  </pre>
                </div>

                {execution.output && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Result Payload
                    </h3>
                    <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-emerald-400 border border-border max-h-60">
                      {typeof execution.output === "string"
                        ? execution.output
                        : JSON.stringify(execution.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-12 text-center text-sm text-muted-foreground">
                No active execution selected.
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
