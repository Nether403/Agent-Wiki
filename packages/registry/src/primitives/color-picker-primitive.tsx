/**
 * @license MIT
 * @origin Ark UI (https://github.com/chakra-ui/ark) / Ariakit
 * @author Chakra Systems & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState, useId } from "react";
import { Pipette, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorPickerPrimitiveProps {
  initialHex?: string;
  onColorChange?: (hex: string) => void;
  className?: string;
}

const PRESET_PALETTE = [
  "#09090b",
  "#27272a",
  "#71717a",
  "#e4e4e7",
  "#fafafa",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
];

export function ColorPickerPrimitive({
  initialHex = "#27272a",
  onColorChange,
  className,
}: ColorPickerPrimitiveProps) {
  const [selectedHex, setSelectedHex] = useState<string>(initialHex);
  const [copied, setCopied] = useState<boolean>(false);
  const inputId = useId();

  const handleSelect = (hex: string) => {
    setSelectedHex(hex);
    onColorChange?.(hex);
  };

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(selectedHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col w-72 rounded-xl border border-border bg-card p-4 text-foreground shadow-sm",
        className
      )}
      role="region"
      aria-label="Accessible Headless Color Picker"
    >
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <span className="text-xs font-semibold">Color Selection</span>
        <div className="flex items-center gap-1.5">
          <div
            className="h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: selectedHex }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs text-muted-foreground">{selectedHex}</span>
        </div>
      </div>

      {/* Preset Swatches Palette */}
      <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Color swatches">
        {PRESET_PALETTE.map((hex) => {
          const isCurrent = hex.toLowerCase() === selectedHex.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              role="radio"
              aria-checked={isCurrent}
              aria-label={`Color ${hex}`}
              onClick={() => handleSelect(hex)}
              className={cn(
                "relative flex h-8 w-full items-center justify-center rounded-md border transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isCurrent ? "border-primary ring-2 ring-primary" : "border-border"
              )}
              style={{ backgroundColor: hex }}
            >
              {isCurrent && (
                <Check
                  className={cn(
                    "h-3.5 w-3.5",
                    hex === "#fafafa" || hex === "#e4e4e7" ? "text-zinc-900" : "text-white"
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Hex Custom Input Field */}
      <div className="mt-4 flex items-center gap-2">
        <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
          HEX
        </label>
        <input
          id={inputId}
          type="text"
          value={selectedHex}
          onChange={(e) => handleSelect(e.target.value)}
          className="flex-1 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
        <button
          type="button"
          onClick={copyToClipboard}
          aria-label="Copy hex color code"
          className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
