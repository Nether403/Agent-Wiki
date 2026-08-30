---
id: "publication-showcase-card"
name: "Publication Showcase Card"
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

# Publication Showcase Card (`publication-showcase-card`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add publication-showcase-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/publication-showcase-card.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin HugoBlox Kit (https://github.com/HugoBlox/kit)
 * @author HugoBlox & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { BookOpen, ExternalLink, FileText, Share2 } from "lucide-react";

export interface PublicationShowcaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  authors: string[];
  venue: string;
  year: number | string;
  doiUrl?: string;
  pdfUrl?: string;
  abstract: string;
  tags?: string[];
}

export function PublicationShowcaseCard({
  title,
  authors,
  venue,
  year,
  doiUrl,
  pdfUrl,
  abstract,
  tags = [],
  className,
  ...props
}: PublicationShowcaseCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground transition-colors duration-200 hover:border-primary/40",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
        <span className="font-semibold text-primary">{venue}</span>
        <span>•</span>
        <span>{year}</span>
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="text-base font-bold tracking-tight text-foreground leading-snug">
        {title}
      </h3>

      <p className="text-xs text-muted-foreground mt-1.5 font-medium">
        {authors.join(", ")}
      </p>

      <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
        <p className={cn(!isExpanded && "line-clamp-2")}>{abstract}</p>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-1 font-mono text-[11px] font-semibold text-primary hover:underline focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          {isExpanded ? "Show Less [-]" : "Read Abstract [+]"}
        </button>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center gap-3">
        {doiUrl && (
          <a
            href={doiUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span>DOI Reference</span>
          </a>
        )}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Download PDF</span>
          </a>
        )}
      </div>
    </article>
  );
}

```
