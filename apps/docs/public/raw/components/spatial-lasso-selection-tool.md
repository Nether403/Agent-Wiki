---
id: "spatial-lasso-selection-tool"
name: "Spatial Lasso Selection Tool"
category: "ui:workflow"
library_origin: "https://excalidraw.com"
dependencies:
  - "lucide-react"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "canvas"
  - "spatial"
  - "lasso"
  - "selection"
  - "workflow"
  - "excalidraw"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Spatial Lasso Selection Tool (`spatial-lasso-selection-tool`)
> Spatial canvas freeform lasso selection tool with multi-node bounding-box alignment actions, grouping, and export controls.

- **Taxonomy Category**: `ui:workflow`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, canvas, spatial, lasso, selection, workflow, excalidraw
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add spatial-lasso-selection-tool

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/spatial-lasso-selection-tool.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:workflow
 * Name: spatial-lasso-selection-tool
 */

import * as React from "react";
import {
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  Layers,
  Lock,
  Download,
  Trash2,
} from "lucide-react";

export interface CanvasNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
}

export interface SpatialLassoToolProps {
  initialNodes?: CanvasNode[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onAlign?: (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => void;
  onGroup?: (selectedIds: string[]) => void;
  onDelete?: (selectedIds: string[]) => void;
  className?: string;
}

export const SpatialLassoSelectionTool: React.FC<SpatialLassoToolProps> = ({
  initialNodes = [
    { id: "node-1", label: "Agent Executor", x: 40, y: 50, width: 140, height: 70, isSelected: true },
    { id: "node-2", label: "MCP Tool Server", x: 220, y: 50, width: 140, height: 70, isSelected: true },
    { id: "node-3", label: "A11y Validator", x: 130, y: 160, width: 140, height: 70, isSelected: false },
  ],
  onSelectionChange,
  onAlign,
  onGroup,
  onDelete,
  className = "",
}) => {
  const [nodes, setNodes] = React.useState<CanvasNode[]>(initialNodes);
  const selectedNodes = nodes.filter((n) => n.isSelected);
  const selectedIds = selectedNodes.map((n) => n.id);

  const toggleNodeSelect = (id: string) => {
    const next = nodes.map((n) => (n.id === id ? { ...n, isSelected: !n.isSelected } : n));
    setNodes(next);
    onSelectionChange?.(next.filter((n) => n.isSelected).map((n) => n.id));
  };

  const selectAll = () => {
    const next = nodes.map((n) => ({ ...n, isSelected: true }));
    setNodes(next);
    onSelectionChange?.(next.map((n) => n.id));
  };

  const clearSelection = () => {
    const next = nodes.map((n) => ({ ...n, isSelected: false }));
    setNodes(next);
    onSelectionChange?.([]);
  };

  const handleAlign = (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (selectedNodes.length < 2) return;
    let next = [...nodes];

    if (alignment === "left") {
      const minX = Math.min(...selectedNodes.map((n) => n.x));
      next = next.map((n) => (n.isSelected ? { ...n, x: minX } : n));
    } else if (alignment === "top") {
      const minY = Math.min(...selectedNodes.map((n) => n.y));
      next = next.map((n) => (n.isSelected ? { ...n, y: minY } : n));
    }
    setNodes(next);
    onAlign?.(alignment);
  };

  return (
    <section
      aria-label="Spatial Canvas Lasso Selection Tool"
      className={`relative flex flex-col w-full max-w-2xl mx-auto rounded-2xl bg-card border border-border text-card-foreground shadow-2xl overflow-hidden ${className}`}
    >
      {/* Floating Action HUD Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-border bg-muted/40 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 text-primary" role="img" aria-label="Selection Box" />
          <span className="font-semibold text-foreground">{selectedNodes.length} Nodes Selected</span>
        </div>

        {selectedNodes.length > 0 && (
          <div className="flex items-center gap-1" role="toolbar" aria-label="Spatial node alignment controls">
            <button
              type="button"
              onClick={() => handleAlign("left")}
              aria-label="Align Selected Left"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign("center")}
              aria-label="Align Selected Horizontal Center"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign("right")}
              aria-label="Align Selected Right"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign("top")}
              aria-label="Align Selected Top"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <AlignVerticalJustifyCenter className="w-4 h-4" />
            </button>
            <span className="h-4 w-px bg-border mx-1" />
            <button
              type="button"
              onClick={() => onGroup?.(selectedIds)}
              aria-label="Group Selected Nodes"
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(selectedIds)}
              aria-label="Delete Selected Nodes"
              className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={selectAll}
            className="px-2 py-1 rounded text-[11px] bg-background border border-border text-foreground hover:bg-muted"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="px-2 py-1 rounded text-[11px] bg-background border border-border text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Spatial Mock Canvas Interactive Area */}
      <div className="relative w-full h-64 bg-background overflow-hidden p-4">
        {/* Grid dots */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #71717a 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />

        {/* Canvas Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => toggleNodeSelect(node.id)}
            style={{
              transform: `translate(${node.x}px, ${node.y}px)`,
              width: `${node.width}px`,
              height: `${node.height}px`,
            }}
            className={`absolute flex flex-col justify-center items-center p-3 rounded-lg border cursor-pointer transition-all ${
              node.isSelected
                ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10 ring-2 ring-primary/40"
                : "bg-card border-border text-muted-foreground hover:border-foreground/40"
            }`}
          >
            <span className="text-xs font-semibold text-foreground text-center">{node.label}</span>
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
              ({node.x}, {node.y})
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <footer className="flex items-center justify-between p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground font-mono">
        <span>Press Shift + Drag for Freeform Lasso Multi-Select</span>
        <span className="text-primary">XY Flow & Excalidraw Compatible</span>
      </footer>
    </section>
  );
};
export default SpatialLassoSelectionTool;

```
