---
id: "theme-toggle-dropdown"
name: "Theme Toggle Dropdown"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Theme Toggle Dropdown (`theme-toggle-dropdown`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add theme-toggle-dropdown

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/theme-toggle-dropdown.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";

export interface ThemeToggleDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  onThemeSelect?: (theme: "light" | "dark" | "system") => void;
}

export function ThemeToggleDropdown({
  onThemeSelect,
  className,
  ...props
}: ThemeToggleDropdownProps) {
  const [selectedTheme, setSelectedTheme] = React.useState<"light" | "dark" | "system">("dark");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
    setIsOpen(false);
    onThemeSelect?.(theme);

    if (theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", systemDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  };

  return (
    <div className={cn("relative inline-block text-left", className)} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-card-foreground text-xs font-semibold hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-xs"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Theme selection dropdown"
      >
        {selectedTheme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />}
        {selectedTheme === "dark" && <Moon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
        {selectedTheme === "system" && <Laptop className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
        <span className="capitalize">{selectedTheme}</span>
        <ChevronDown className="h-3 w-3 opacity-60" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-36 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in-50 zoom-in-95"
        >
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              role="option"
              aria-selected={t === selectedTheme}
              onClick={() => handleSelect(t)}
              className={cn(
                "flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs text-left capitalize transition-colors focus-visible:outline-none focus-visible:bg-accent",
                t === selectedTheme ? "bg-accent text-accent-foreground font-semibold" : "text-popover-foreground hover:bg-muted"
              )}
            >
              <span>{t}</span>
              {t === selectedTheme && <Check className="h-3 w-3 text-primary" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

```
