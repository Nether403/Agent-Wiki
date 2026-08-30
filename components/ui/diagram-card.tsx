/**
 * @license MIT
 * @origin diagram-design (https://diagram.com)
 * @author diagram-design team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { ArrowUpRight, Cpu, Layers } from "lucide-react";
import { cn } from "../lib/utils";

export interface DiagramNode {
  id: string;
  title: string;
  badge: string;
  description: string;
}

export interface DiagramCardProps {
  nodes?: DiagramNode[];
  className?: string;
}

const DEFAULT_NODES: DiagramNode[] = [
  {
    id: "01",
    title: "Ingestion Pipeline",
    badge: "AST Parse",
    description: "Extracts AST structures, dependencies, and verifies SPDX license headers.",
  },
  {
    id: "02",
    title: "Anti-Slop Engine",
    badge: "Verification",
    description: "Evaluates code against 20 strict design-system rules and WCAG AA contrast.",
  },
  {
    id: "03",
    title: "Static Compiler",
    badge: "CDN Edge",
    description: "Builds atomic /r/ endpoints and /llms.txt discovery manifests.",
  },
];

export function DiagramCard({ nodes = DEFAULT_NODES, className }: DiagramCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Architecture Map
          </span>
        </div>
        <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
          v1.0.0
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {nodes.map((node, i) => (
          <div
            key={node.id}
            className="group relative rounded-xl border border-border/80 bg-background/60 p-4 transition-colors hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{node.id}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {node.badge}
              </span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-foreground">{node.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {node.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
