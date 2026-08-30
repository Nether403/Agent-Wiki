/**
 * @license MIT
 * @origin GUI Challenges & React Spectrum (https://github.com/argyleink/gui-challenges)
 * @author Adam Argyle & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SplitButtonOption {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  primaryLabel: string;
  onPrimaryClick: () => void;
  options: SplitButtonOption[];
  disabled?: boolean;
}

export function SplitButton({
  primaryLabel,
  onPrimaryClick,
  options,
  disabled = false,
  className,
  ...props
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={cn("inline-flex items-center rounded-md shadow-xs relative", className)}
      {...props}
    >
      {/* Primary Action Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onPrimaryClick}
        className="inline-flex items-center justify-center rounded-l-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
      >
        {primaryLabel}
      </button>

      {/* Menu Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="More actions menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-r-md border-l border-primary-foreground/20 bg-primary px-2 py-2 text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
      >
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-1.5 w-48 rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground z-50 focus:outline-hidden"
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              role="menuitem"
              disabled={opt.disabled}
              onClick={() => {
                opt.onClick();
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-xs rounded-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
