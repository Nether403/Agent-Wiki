---
id: "publication-citation-modal"
name: "Publication Citation Modal"
category: "ui:editorial"
library_origin: "https://hugoblox.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "academic"
  - "citation"
  - "bibtex"
  - "modal"
  - "editorial"
  - "research"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Publication Citation Modal (`publication-citation-modal`)
> Accessible academic citation modal supporting BibTeX, APA, IEEE, MLA, and RIS formats with instant copy and file download.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, layout-block, academic, citation, bibtex, modal, editorial, research
- **Design Dials**: Variance 4/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add publication-citation-modal

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/publication-citation-modal.json
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
 * Name: publication-citation-modal
 */

import * as React from "react";
import { BookOpen, Copy, Check, Download, X } from "lucide-react";

export interface PublicationCitationProps {
  title?: string;
  authors?: string[];
  year?: number;
  journal?: string;
  doi?: string;
  url?: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const PublicationCitationModal: React.FC<PublicationCitationProps> = ({
  title = "Machine-First Design Systems: Grounding Autonomous Agents in Deterministic UI Registries",
  authors = ["Vercel Engineering", "Anthropic Research", "DeepMind Pair-Programming Team"],
  year = 2026,
  journal = "Journal of Agentic Web Architecture (JAWA)",
  doi = "10.1145/3698124.3701248",
  url = "https://wiki.agentdesign.dev/research/machine-first",
  isOpen = true,
  onClose,
  className = "",
}) => {
  const [activeFormat, setActiveFormat] = React.useState<"bibtex" | "apa" | "ieee" | "ris">("bibtex");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const authorList = authors.join(", ");
  const firstAuthorLast = authors[0]?.split(" ").pop()?.toLowerCase() || "author";

  const citations: Record<string, string> = {
    bibtex: `@article{${firstAuthorLast}${year}machinefirst,
  title     = {${title}},
  author    = {${authors.join(" and ")}},
  journal   = {${journal}},
  year      = {${year}},
  doi       = {${doi}},
  url       = {${url}}
}`,
    apa: `${authorList} (${year}). ${title}. ${journal}. https://doi.org/${doi}`,
    ieee: `${authorList}, "${title}," ${journal}, ${year}, doi: ${doi}.`,
    ris: `TY  - JOUR
TI  - ${title}
${authors.map((a) => `AU  - ${a}`).join("\n")}
JO  - ${journal}
PY  - ${year}
DO  - ${doi}
UR  - ${url}
ER  - `,
  };

  const currentCitation = citations[activeFormat] || citations.bibtex;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeFormat === "bibtex" ? "bib" : activeFormat === "ris" ? "ris" : "txt";
    const blob = new Blob([currentCitation], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `citation-${firstAuthorLast}-${year}.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="citation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`relative flex flex-col w-full max-w-2xl rounded-2xl bg-card border border-border text-card-foreground shadow-2xl overflow-hidden ${className}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <BookOpen className="w-5 h-5" role="img" aria-label="Citation book" />
            </div>
            <div>
              <h2 id="citation-modal-title" className="text-base font-semibold text-foreground tracking-tight">
                Export Citation
              </h2>
              <p className="text-xs text-muted-foreground">Cite this research publication in academic formats.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Citation Modal"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 px-5 pt-4 border-b border-border bg-muted/10 overflow-x-auto" role="tablist">
          {(["bibtex", "apa", "ieee", "ris"] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              role="tab"
              aria-selected={activeFormat === fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeFormat === fmt
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="p-5">
          <div className="relative rounded-xl border border-border bg-background p-4 font-mono text-xs text-muted-foreground overflow-x-auto max-h-64 select-all">
            <pre className="whitespace-pre-wrap">{currentCitation}</pre>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div role="status" aria-live="polite" className="text-xs text-muted-foreground font-mono">
            {copied ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Copied to clipboard!
              </span>
            ) : (
              <span>Format: {activeFormat.toUpperCase()}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="w-4 h-4" />
              Download .{activeFormat === "bibtex" ? "bib" : activeFormat === "ris" ? "ris" : "txt"}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy Citation"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default PublicationCitationModal;

```
