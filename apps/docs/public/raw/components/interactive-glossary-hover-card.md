---
id: "interactive-glossary-hover-card"
name: "Interactive Glossary Hover Card"
category: "ui:editorial"
library_origin: "https://design-wiki.dev"
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
  - "glossary"
  - "hover-card"
  - "popover"
  - "editorial"
  - "documentation"
  - "a11y"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Interactive Glossary Hover Card (`interactive-glossary-hover-card`)
> Inline technical term lookup card with accessible popover definition, related taxonomy tags, and keyboard navigable drawer.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, glossary, hover-card, popover, editorial, documentation, a11y
- **Design Dials**: Variance 4/10 · Motion 2/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add interactive-glossary-hover-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/interactive-glossary-hover-card.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:editorial
 * Name: interactive-glossary-hover-card
 */

import * as React from "react";
import { HelpCircle, ExternalLink, Tag } from "lucide-react";

export interface GlossaryHoverCardProps {
  term?: string;
  pronunciation?: string;
  category?: string;
  definition?: string;
  exampleUsage?: string;
  relatedTags?: string[];
  referenceUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

export const InteractiveGlossaryHoverCard: React.FC<GlossaryHoverCardProps> = ({
  term = "Zero-Draft Fidelity",
  pronunciation = "/ˈzɪərəʊ drɑːft fɪˈdɛlɪti/",
  category = "Agentic Architecture",
  definition = "The mathematical metric measuring an AI coding agent's ability to generate production-grade, compilable code (>90% success) on the initial attempt without requiring iterative debugging.",
  exampleUsage = "Our Turborepo harness enforces >90% Zero-Draft Fidelity via automated Axe-core and Playwright CI test gates.",
  relatedTags = ["ast-codemods", "anti-slop", "mcp-grounding"],
  referenceUrl = "https://wiki.agentdesign.dev/architecture/zero-draft",
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen]);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Trigger */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-primary decoration-dotted underline-offset-4 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-0.5"
      >
        {children || term}
        <HelpCircle className="w-3.5 h-3.5 text-primary/70 inline" role="img" aria-label="Definition available" />
      </button>

      {/* Floating Accessible Hover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Definition for ${term}`}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-4 rounded-xl bg-card border border-border text-card-foreground shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2 border-b border-border pb-2">
              <div>
                <h4 className="text-sm font-bold text-foreground tracking-tight">{term}</h4>
                {pronunciation && <p className="text-[11px] font-mono text-muted-foreground">{pronunciation}</p>}
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary uppercase">
                {category}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{definition}</p>

            {exampleUsage && (
              <div className="p-2 rounded bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground italic">
                &ldquo;{exampleUsage}&rdquo;
              </div>
            )}

            {relatedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <Tag className="w-3 h-3 text-muted-foreground" role="img" aria-label="Tags" />
                {relatedTags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {referenceUrl && (
              <div className="pt-2 border-t border-border flex justify-end">
                <a
                  href={referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  Read full wiki doc <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
};
export default InteractiveGlossaryHoverCard;

```
