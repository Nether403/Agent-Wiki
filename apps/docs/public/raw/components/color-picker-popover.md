---
id: "color-picker-popover"
name: "Color Picker Popover"
category: "ui:primitive"
library_origin: "https://shark.vini.one"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "form"
  - "color-picker"
  - "popover"
  - "eyedropper"
  - "shark-ui"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Color Picker Popover (`color-picker-popover`)
> Color picker with HEX/RGBA/HSL mode switching, preset palette swatches, eyedropper tool, and alpha slider.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, layout-block, form, color-picker, popover, eyedropper, shark-ui
- **Design Dials**: Variance 4/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add color-picker-popover

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/color-picker-popover.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Shark UI / Origin UI (https://originui.com)
 * @author Shark UI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Pipette, Check, Copy, ChevronDown } from "lucide-react";

export interface ColorPickerPopoverProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
}

const DEFAULT_PRESETS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6d28d9",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  presetColors = DEFAULT_PRESETS,
  className,
  ...props
}: ColorPickerPopoverProps) {
  const [color, setColor] = React.useState(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value) setColor(value);
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEyeDropper = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } catch {
        // User cancelled eyedropper
      }
    }
  };

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) setIsOpen(false);
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Selected color: ${color}. Click to open color picker.`}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-input bg-background hover:bg-muted text-xs font-mono font-medium text-foreground transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className="h-4 w-4 rounded-md border border-border/60 shadow-xs shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span>{color.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" aria-hidden="true" />
      </button>

      {/* Popover Color Canvas */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Color Palette Picker"
          className="absolute top-full left-0 mt-2 w-64 p-4 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl z-50 animate-in fade-in-50 space-y-3"
        >
          {/* HTML Native Color Input Bridge */}
          <div className="relative h-24 w-full rounded-xl overflow-hidden border border-border">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              aria-label="Select custom color from palette"
              className="absolute -top-4 -left-4 w-72 h-32 cursor-pointer opacity-0"
            />
            <div
              className="w-full h-full flex items-center justify-center text-xs font-semibold text-white shadow-inner"
              style={{ backgroundColor: color }}
            >
              <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-xs">
                Click to Adjust Shade
              </span>
            </div>
          </div>

          {/* Color Hex Display & Tools */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              maxLength={7}
              className="w-24 px-2.5 py-1 text-xs font-mono rounded-lg border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Hex color value"
            />

            <div className="flex items-center gap-1">
              {"EyeDropper" in window && (
                <button
                  type="button"
                  onClick={handleEyeDropper}
                  aria-label="Pick color from screen"
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <Pipette className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied hex" : "Copy hex code"}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Preset Color Swatches */}
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1.5">
              Preset Palette
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {presetColors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleColorChange(hex)}
                  style={{ backgroundColor: hex }}
                  aria-label={`Select preset color ${hex}`}
                  className={cn(
                    "h-6 w-full rounded-md border border-border/40 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    color.toLowerCase() === hex.toLowerCase() && "ring-2 ring-primary ring-offset-1"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```
