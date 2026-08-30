---
id: "otp-pin-input"
name: "OTP PIN One-Time Input"
category: "ui:primitive"
library_origin: "https://originui.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "form"
  - "otp"
  - "pin-input"
  - "origin-ui"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# OTP PIN One-Time Input (`otp-pin-input`)
> Accessible 6-digit PIN/OTP input with auto-focus advance, backspace regression, paste-handling, and masked character support.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, form, otp, pin-input, origin-ui
- **Design Dials**: Variance 3/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add otp-pin-input

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/otp-pin-input.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Origin UI / Shark UI (https://originui.com)
 * @author Origin UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface OtpPinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  masked?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpPinInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  masked = false,
  disabled = false,
  autoFocus = false,
  className,
  ...props
}: OtpPinInputProps) {
  const [pin, setPin] = React.useState<string[]>(() => {
    const initial = value.split("").slice(0, length);
    while (initial.length < length) initial.push("");
    return initial;
  });

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (value !== undefined) {
      const updated = value.split("").slice(0, length);
      while (updated.length < length) updated.push("");
      setPin(updated);
    }
  }, [value, length]);

  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const char = val.slice(-1); // Take last entered character

    if (val && !/^\d+$/.test(char)) return; // Digits only

    const newPin = [...pin];
    newPin[idx] = char;
    setPin(newPin);

    const combined = newPin.join("");
    onChange?.(combined);

    if (char && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }

    if (combined.length === length && !newPin.includes("")) {
      onComplete?.(combined);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!pin[idx] && idx > 0) {
        const newPin = [...pin];
        newPin[idx - 1] = "";
        setPin(newPin);
        inputRefs.current[idx - 1]?.focus();
        onChange?.(newPin.join(""));
      } else {
        const newPin = [...pin];
        newPin[idx] = "";
        setPin(newPin);
        onChange?.(newPin.join(""));
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim().replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    const newPin = pasted.split("");
    while (newPin.length < length) newPin.push("");
    setPin(newPin);

    const combined = newPin.join("");
    onChange?.(combined);

    const nextIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (pasted.length === length) {
      onComplete?.(combined);
    }
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label="PIN One-Time Password Input"
      {...props}
    >
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type={masked ? "password" : "text"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={pin[idx] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${idx + 1} of ${length}`}
          className={cn(
            "h-12 w-10 text-center text-lg font-mono font-semibold rounded-xl border border-input bg-background text-foreground shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            pin[idx] ? "border-primary text-primary" : "border-border"
          )}
        />
      ))}
    </div>
  );
}

```
