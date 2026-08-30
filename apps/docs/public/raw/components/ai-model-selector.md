---
id: "ai-model-selector"
name: "Ai Model Selector"
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

# Ai Model Selector (`ai-model-selector`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-model-selector

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-model-selector.json
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
import { Sparkles, Zap, Brain, ChevronDown, Check } from "lucide-react";

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  speed: "Fast" | "Standard" | "Reasoning";
  badge?: string;
}

export interface AiModelSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  models?: ModelOption[];
  selectedId?: string;
  onSelect?: (model: ModelOption) => void;
}

const DEFAULT_MODELS: ModelOption[] = [
  { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic", contextWindow: "200k", speed: "Reasoning", badge: "Flagship" },
  { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", contextWindow: "200k", speed: "Fast", badge: "Low Latency" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", contextWindow: "128k", speed: "Fast" },
  { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", provider: "Google", contextWindow: "1M", speed: "Standard", badge: "Ultra Context" },
];

export function AiModelSelector({
  models = DEFAULT_MODELS,
  selectedId = "claude-3-7-sonnet",
  onSelect,
  className,
  ...props
}: AiModelSelectorProps) {
  const [currentId, setCurrentId] = React.useState(selectedId);
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedModel = models.find((m) => m.id === currentId) || models[0];

  const handleSelect = (model: ModelOption) => {
    setCurrentId(model.id);
    onSelect?.(model);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-block text-left", className)} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-xs"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Foundation AI Model"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="font-semibold">{selectedModel.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
          {selectedModel.contextWindow}
        </span>
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 mt-1.5 w-64 rounded-xl border border-border bg-popover p-1.5 shadow-lg z-50 animate-in fade-in-50 zoom-in-95"
        >
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Foundation Models
          </div>
          {models.map((m) => {
            const isSelected = m.id === currentId;
            return (
              <button
                key={m.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(m)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs text-left transition-colors focus-visible:outline-none focus-visible:bg-accent",
                  isSelected ? "bg-accent text-accent-foreground font-medium" : "text-popover-foreground hover:bg-muted/60"
                )}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span>{m.name}</span>
                    {m.badge && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-semibold">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {m.provider} · {m.contextWindow} window
                  </span>
                </div>

                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

```
