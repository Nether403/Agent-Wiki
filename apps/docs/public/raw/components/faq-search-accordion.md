---
id: "faq-search-accordion"
name: "F A Q Search Accordion"
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

# F A Q Search Accordion (`faq-search-accordion`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add faq-search-accordion

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/faq-search-accordion.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Page UI & Tailark (https://tailark.com)
 * @author Page UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Search, ChevronDown } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQSearchAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQSearchAccordion({
  faqs,
  title = "Frequently Asked Architectural Questions",
  subtitle = "Everything you need to know about machine-first registries, taste dials, and deterministic AI agents.",
  className,
  ...props
}: FAQSearchAccordionProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openIds, setOpenIds] = React.useState<string[]>([faqs[0]?.id || ""]);

  const filteredFaqs = React.useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q))
    );
  }, [faqs, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className={cn("mx-auto w-full max-w-4xl px-4 py-12", className)} {...props}>
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Search Bar Input */}
        <div className="relative mx-auto mt-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search questions by keyword or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Filter frequently asked questions"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="mt-8 space-y-3" role="region" aria-label="FAQ Accordion items">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No matching questions found for &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent-foreground/20"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-semibold text-foreground text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-foreground"
                    )}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="border-t border-border px-4 py-4 sm:px-5 text-sm text-muted-foreground leading-relaxed"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

```
