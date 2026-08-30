---
id: "multi-tag-input"
name: "Multi-Tag Keyboard Input"
category: "ui:primitive"
library_origin: "https://shark.vini.one"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "form"
  - "tags"
  - "multi-input"
  - "autocomplete"
  - "shark-ui"
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

# Multi-Tag Keyboard Input (`multi-tag-input`)
> Keyboard-navigable badge input with tag creation, backspace deletion, autocomplete suggestions, and duplicate prevention.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, form, tags, multi-input, autocomplete, shark-ui
- **Design Dials**: Variance 3/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add multi-tag-input

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/multi-tag-input.json
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
 * @author Shark UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { X, Plus, Tag } from "lucide-react";

export interface MultiTagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  onChange?: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

export function MultiTagInput({
  value = [],
  onChange,
  suggestions = ["React", "TypeScript", "TailwindCSS", "Next.js", "Zustand", "A11y"],
  placeholder = "Add tag and press Enter...",
  maxTags = 12,
  disabled = false,
  className,
  ...props
}: MultiTagInputProps) {
  const [tags, setTags] = React.useState<string[]>(value);
  const [inputValue, setInputValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value !== undefined) setTags(value);
  }, [value]);

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
    const nextTags = [...tags, trimmed];
    setTags(nextTags);
    onChange?.(nextTags);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    const nextTags = tags.filter((t) => t !== tagToRemove);
    setTags(nextTags);
    onChange?.(nextTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !tags.includes(s) &&
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      inputValue.trim().length > 0
  );

  return (
    <div className={cn("relative flex flex-col w-full space-y-1.5", className)} {...props}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex flex-wrap items-center gap-1.5 p-2 rounded-xl border bg-background transition-colors cursor-text min-h-11",
          isFocused ? "border-ring ring-2 ring-ring ring-offset-background" : "border-input",
          disabled && "opacity-50 cursor-not-allowed bg-muted"
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
          >
            <Tag className="h-3 w-3" aria-hidden="true" />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                aria-label={`Remove ${tag} tag`}
                className="p-0.5 rounded-full hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </span>
        ))}

        {!disabled && tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-24 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
            aria-label="Add new tag"
          />
        )}
      </div>

      {/* Autocomplete dropdown */}
      {isFocused && filteredSuggestions.length > 0 && (
        <div
          className="absolute top-full left-0 mt-1 w-full rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-popover-foreground animate-in fade-in-50"
          role="listbox"
          aria-label="Suggested Tags"
        >
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(suggestion);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left hover:bg-accent hover:text-accent-foreground text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              role="option"
              aria-selected={false}
            >
              <span>{suggestion}</span>
              <Plus className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

```
