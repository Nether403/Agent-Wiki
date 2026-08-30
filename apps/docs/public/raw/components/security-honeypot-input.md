---
id: "security-honeypot-input"
name: "Security Honeypot Input"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Security Honeypot Input (`security-honeypot-input`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add security-honeypot-input

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/security-honeypot-input.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tripwire Security (https://tripwire.sh)
 * @author Tripwire & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface SecurityHoneypotProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onBotTrapTriggered?: (trapValue: string) => void;
}

export function SecurityHoneypotInput({
  onBotTrapTriggered,
  className,
  ...props
}: SecurityHoneypotProps) {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    if (val.length > 0 && onBotTrapTriggered) {
      onBotTrapTriggered(val);
    }
  };

  return (
    <div
      style={{
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <label htmlFor="website_hp_field">Leave this field blank to verify human request</label>
      <input
        id="website_hp_field"
        name="website_hp_field"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

```
