/**
 * SPDX-License-Identifier: MIT
 * Source: Machine-First Design Agent Wiki (Inspired by primer/react & cloudscape & heroui)
 * Category: ui:primitive
 * Description: Accessible multi-step workflow stepper with status icons (completed, active, upcoming, error), step descriptions, and form navigation.
 */

import * as React from "react";
import { Check, Circle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface StepItem {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "current" | "upcoming" | "error";
}

interface ProgressWizardStepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function ProgressWizardStepper({
  steps,
  currentStepIndex,
  onStepClick,
  orientation = "horizontal",
  className,
}: ProgressWizardStepperProps) {
  return (
    <nav
      aria-label="Progress Stepper"
      className={cn(
        "w-full",
        orientation === "horizontal" ? "flex items-center justify-between" : "flex flex-col space-y-4",
        className
      )}
    >
      <ol
        className={cn(
          "w-full",
          orientation === "horizontal"
            ? "flex items-center justify-between"
            : "flex flex-col space-y-6"
        )}
      >
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed" || idx < currentStepIndex;
          const isCurrent = step.status === "current" || idx === currentStepIndex;
          const isError = step.status === "error";

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex items-center",
                orientation === "horizontal" ? "flex-1 last:flex-none" : "w-full"
              )}
            >
              <button
                type="button"
                onClick={() => onStepClick?.(idx)}
                disabled={!onStepClick}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 transition-colors",
                  !onStepClick && "cursor-default"
                )}
              >
                {/* Step Marker Indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold border transition-colors shrink-0",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/10 text-primary ring-4 ring-primary/20",
                    isError && "bg-rose-500/10 border-rose-500 text-rose-500",
                    !isCompleted && !isCurrent && !isError && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : isError ? (
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight transition-colors",
                      isCurrent ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-[11px] text-muted-foreground">{step.description}</span>
                  )}
                </div>
              </button>

              {/* Connecting Line (Horizontal) */}
              {orientation === "horizontal" && idx < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
