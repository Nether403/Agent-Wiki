/**
 * @origin Zag.js & Ark UI (https://github.com/chakra-ui/zag, https://github.com/chakra-ui/ark)
 * @license MIT
 * @author Segun Adebayo & Chakra Systems
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { ArrowRight, Play, RotateCcw, Activity, ShieldCheck, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MachineStateNode {
  id: string;
  name: string;
  type: "initial" | "intermediate" | "final" | "error";
  description: string;
  availableEvents: string[];
}

export interface StateMachineFlowControllerProps {
  initialState?: string;
  states?: MachineStateNode[];
  transitions?: Record<string, Record<string, string>>;
  onStateChange?: (newState: string, event: string) => void;
  className?: string;
}

const DEFAULT_MACHINE_STATES: MachineStateNode[] = [
  {
    id: "idle",
    name: "Idle State",
    type: "initial",
    description: "Waiting for user action or automated pipeline dispatch.",
    availableEvents: ["DISPATCH_PROMPT", "VALIDATE_CACHE"],
  },
  {
    id: "synthesizing",
    name: "Synthesizing UI",
    type: "intermediate",
    description: "Agent is actively assembling AST components and resolving tokens.",
    availableEvents: ["GENERATION_SUCCESS", "SYNTAX_ERROR", "ABORT"],
  },
  {
    id: "verifying",
    name: "Zero-Slop Verification",
    type: "intermediate",
    description: "Running 50 anti-slop rules, axe-core scans, and compilation check.",
    availableEvents: ["AUDIT_PASSED", "SLOP_DETECTED"],
  },
  {
    id: "ready",
    name: "Production Ready",
    type: "final",
    description: "100% WCAG AA verified with 0 slop flags and clean build output.",
    availableEvents: ["RESET"],
  },
  {
    id: "remediating",
    name: "Remediation Auto-Codemod",
    type: "error",
    description: "Auto-remapping arbitrary spacing and fixing contrast violations.",
    availableEvents: ["REPAIR_COMPLETE", "ABORT"],
  },
];

const DEFAULT_TRANSITIONS: Record<string, Record<string, string>> = {
  idle: {
    DISPATCH_PROMPT: "synthesizing",
    VALIDATE_CACHE: "verifying",
  },
  synthesizing: {
    GENERATION_SUCCESS: "verifying",
    SYNTAX_ERROR: "remediating",
    ABORT: "idle",
  },
  verifying: {
    AUDIT_PASSED: "ready",
    SLOP_DETECTED: "remediating",
  },
  ready: {
    RESET: "idle",
  },
  remediating: {
    REPAIR_COMPLETE: "verifying",
    ABORT: "idle",
  },
};

export function StateMachineFlowController({
  initialState = "idle",
  states = DEFAULT_MACHINE_STATES,
  transitions = DEFAULT_TRANSITIONS,
  onStateChange,
  className,
}: StateMachineFlowControllerProps) {
  const [currentStateId, setCurrentStateId] = React.useState(initialState);
  const [history, setHistory] = React.useState<string[]>([initialState]);

  const currentState = React.useMemo(() => {
    return states.find((s) => s.id === currentStateId) || states[0];
  }, [states, currentStateId]);

  const triggerEvent = React.useCallback(
    (event: string) => {
      const nextStateId = transitions[currentStateId]?.[event];
      if (nextStateId) {
        setCurrentStateId(nextStateId);
        setHistory((prev) => [...prev, nextStateId]);
        onStateChange?.(nextStateId, event);
      }
    },
    [currentStateId, transitions, onStateChange]
  );

  const resetMachine = React.useCallback(() => {
    setCurrentStateId(initialState);
    setHistory([initialState]);
    onStateChange?.(initialState, "RESET");
  }, [initialState, onStateChange]);

  return (
    <div className={cn("w-full space-y-5 rounded-xl border border-border bg-card p-5 shadow-xs select-none", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" role="img" aria-hidden="true" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Finite State Machine UI Controller
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Deterministic Zag.js-inspired state transitions for complex agentic interaction flows.
          </p>
        </div>

        <button
          type="button"
          onClick={resetMachine}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
        >
          <RotateCcw className="h-3 w-3" role="img" aria-hidden="true" /> Reset Machine
        </button>
      </div>

      {/* State Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {states.map((state) => {
          const isActive = state.id === currentStateId;
          return (
            <div
              key={state.id}
              className={cn(
                "flex flex-col justify-between rounded-lg border p-3 text-xs transition-all duration-200",
                isActive
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                  : "border-border/70 bg-background/50 opacity-70"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xs uppercase font-semibold text-muted-foreground">
                    {state.type}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div className="font-semibold text-foreground">{state.name}</div>
              </div>
              <p className="text-3xs text-muted-foreground mt-2 leading-relaxed">
                {state.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active State Context & Trigger Controls */}
      <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Current State: <strong className="text-foreground font-mono">{currentState.id}</strong>
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Transition Steps: {history.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Emit Event:
          </span>
          {currentState.availableEvents.map((evt) => (
            <button
              key={evt}
              type="button"
              onClick={() => triggerEvent(evt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-xs"
            >
              <Play className="h-2.5 w-2.5 fill-primary-foreground" role="img" aria-hidden="true" />
              <span>{evt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
