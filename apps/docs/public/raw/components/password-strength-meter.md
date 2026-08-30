---
id: "password-strength-meter"
name: "Password Strength Entropy Meter"
category: "ui:primitive"
library_origin: "https://originui.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "wai-aria-compliant"
  - "form"
  - "password-strength"
  - "security"
  - "origin-ui"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Password Strength Entropy Meter (`password-strength-meter`)
> Real-time zxcvbn-style entropy scoring bar with visual requirement checklist.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, wai-aria-compliant, form, password-strength, security, origin-ui
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add password-strength-meter

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/password-strength-meter.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Origin UI (https://originui.com)
 * @author Origin UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Check, X, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export interface PasswordStrengthMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  password: string;
  minLength?: number;
}

export function PasswordStrengthMeter({
  password = "",
  minLength = 8,
  className,
  ...props
}: PasswordStrengthMeterProps) {
  const requirements = React.useMemo(() => {
    return [
      { label: `At least ${minLength} characters`, met: password.length >= minLength },
      { label: "Contains at least 1 uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Contains at least 1 number", met: /[0-9]/.test(password) },
      { label: "Contains at least 1 special symbol (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password, minLength]);

  const score = React.useMemo(() => {
    let pts = 0;
    if (password.length >= minLength) pts += 1;
    if (password.length >= minLength + 4) pts += 1;
    if (/[A-Z]/.test(password)) pts += 1;
    if (/[0-9]/.test(password)) pts += 1;
    if (/[^A-Za-z0-9]/.test(password)) pts += 1;
    return Math.min(4, pts);
  }, [password, minLength]);

  const scoreLabel = React.useMemo(() => {
    if (!password) return "Enter password";
    if (score <= 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  }, [score, password]);

  const scoreColor = React.useMemo(() => {
    if (!password) return "bg-muted text-muted-foreground";
    if (score <= 1) return "bg-destructive text-destructive";
    if (score === 2) return "bg-amber-500 text-amber-500";
    if (score === 3) return "bg-blue-500 text-blue-500";
    return "bg-emerald-500 text-emerald-500";
  }, [score, password]);

  return (
    <div
      className={cn("flex flex-col w-full space-y-3", className)}
      role="region"
      aria-label="Password Strength Evaluation"
      {...props}
    >
      {/* Visual meter bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            {score >= 3 ? (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            ) : score >= 2 ? (
              <Shield className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
            )}
            Strength:
          </span>
          <span className={cn("font-semibold text-xs", scoreColor.split(" ")[1])}>
            {scoreLabel}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-full rounded-full transition-colors duration-200",
                idx < score ? scoreColor.split(" ")[0] : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1 pt-1">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" aria-hidden="true" />
            )}
            <span className={cn(req.met ? "text-foreground font-medium" : "text-muted-foreground")}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

```
