---
id: "footer-mega-menu"
name: "Footer Mega Menu"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
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

# Footer Mega Menu (`footer-mega-menu`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add footer-mega-menu

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/footer-mega-menu.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Globe, Terminal, Shield, Sparkles } from "lucide-react";

export interface FooterNavSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterMegaMenuProps extends React.HTMLAttributes<HTMLElement> {
  sections?: FooterNavSection[];
}

const DEFAULT_SECTIONS: FooterNavSection[] = [
  {
    title: "Taxonomy Domains",
    links: [
      { label: "AI-Native Primitives", href: "#" },
      { label: "Editorial Diagrams (39)", href: "#" },
      { label: "Motion & Springs", href: "#" },
      { label: "Procedural 3D & WebGL", href: "#" },
      { label: "Enterprise Application", href: "#" },
    ],
  },
  {
    title: "Governance & Quality",
    links: [
      { label: "30 Anti-Slop Rulepack", href: "#" },
      { label: "Calibrated 1-10 Dials", href: "#" },
      { label: "Tripwire Security Sandbox", href: "#" },
      { label: "Unslop Retheming CLI", href: "#" },
      { label: "WCAG 2.1 AA A11y Suite", href: "#" },
    ],
  },
  {
    title: "Agent Ecosystem",
    links: [
      { label: "Claude Code Integration", href: "#" },
      { label: "Cursor IDE & MDC Rules", href: "#" },
      { label: "Windsurf Cascade Sync", href: "#" },
      { label: "Hermes CLI & OpenClaw", href: "#" },
      { label: "Cloudflare Edge MCP", href: "#" },
    ],
  },
  {
    title: "Open Source Registry",
    links: [
      { label: "llms.txt Specification", href: "/llms.txt" },
      { label: "llms-full.txt Context", href: "/llms-full.txt" },
      { label: "Shadcn v3 Registry Map", href: "/r/" },
      { label: "GitHub Repository", href: "https://github.com/agent-wiki/design-wiki" },
    ],
  },
];

export function FooterMegaMenu({
  sections = DEFAULT_SECTIONS,
  className,
  ...props
}: FooterMegaMenuProps) {
  return (
    <footer
      className={cn(
        "flex flex-col w-full border-t border-border bg-card text-card-foreground p-8 md:p-12 space-y-8",
        className
      )}
      {...props}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
              {section.title}
            </h4>
            <ul className="flex flex-col space-y-2 text-xs text-muted-foreground">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
            W
          </div>
          <span className="font-semibold text-foreground">Machine-First Design Agent Wiki</span>
          <span>© 2026. MIT Licensed.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-500" aria-hidden="true" />
            100% Zero-Slop Verified
          </span>
        </div>
      </div>
    </footer>
  );
}

```
