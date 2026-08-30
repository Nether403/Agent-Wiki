/**
 * @license MIT
 * @origin KokonutUI (https://kokonutui.com)
 * @author KokonutUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            placeholder=" "
            className={cn(
              "peer w-full rounded-xl border border-input bg-background px-4 pt-5 pb-2 text-base text-foreground transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-destructive focus-visible:ring-destructive" : "hover:border-accent-foreground/30",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-xs text-muted-foreground duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary",
              error && "text-destructive peer-focus:text-destructive"
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-destructive font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";
