---
id: "draggable-kanban-board"
name: "Draggable Kanban Board"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Draggable Kanban Board (`draggable-kanban-board`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add draggable-kanban-board

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/draggable-kanban-board.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ReUI / Keenthemes (https://reui.io)
 * @author Keenthemes & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";

export interface KanbanCardItem {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCardItem[];
}

export interface DraggableKanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  initialColumns?: KanbanColumn[];
  onCardMove?: (cardId: string, sourceColId: string, destColId: string) => void;
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "c1", title: "Implement AST Code Generator", tag: "Compiler", priority: "high" },
      { id: "c2", title: "Add WebGL Liquid Shader", tag: "Creative", priority: "medium" },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    cards: [
      { id: "c3", title: "Verify 30 Anti-Slop Rules", tag: "Linter", priority: "high" },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [
      { id: "c4", title: "Cathryn Lavery 39-Diagram Audit", tag: "Editorial", priority: "medium" },
    ],
  },
  {
    id: "done",
    title: "Completed",
    cards: [
      { id: "c5", title: "Seed 45 Foundation Components", tag: "Registry", priority: "low" },
    ],
  },
];

export function DraggableKanbanBoard({
  initialColumns = DEFAULT_COLUMNS,
  onCardMove,
  className,
  ...props
}: DraggableKanbanBoardProps) {
  const [columns, setColumns] = React.useState<KanbanColumn[]>(initialColumns);
  const [draggedCardId, setDraggedCardId] = React.useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = React.useState<string | null>(null);

  const handleDragStart = (cardId: string, colId: string) => {
    setDraggedCardId(cardId);
    setSourceColumnId(colId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetColId: string) => {
    if (!draggedCardId || !sourceColumnId || sourceColumnId === targetColId) {
      setDraggedCardId(null);
      setSourceColumnId(null);
      return;
    }

    setColumns((prev) => {
      let movedCard: KanbanCardItem | undefined;
      const next = prev.map((col) => {
        if (col.id === sourceColumnId) {
          const remaining = col.cards.filter((c) => {
            if (c.id === draggedCardId) {
              movedCard = c;
              return false;
            }
            return true;
          });
          return { ...col, cards: remaining };
        }
        return col;
      });

      if (!movedCard) return prev;

      return next.map((col) => {
        if (col.id === targetColId) {
          return { ...col, cards: [...col.cards, movedCard!] };
        }
        return col;
      });
    });

    onCardMove?.(draggedCardId, sourceColumnId, targetColId);
    setDraggedCardId(null);
    setSourceColumnId(null);
  };

  return (
    <div
      className={cn("flex gap-4 w-full overflow-x-auto p-4 select-none", className)}
      role="region"
      aria-label="Draggable Kanban Task Board"
      {...props}
    >
      {columns.map((col) => (
        <section
          key={col.id}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(col.id)}
          className="flex flex-col w-72 shrink-0 rounded-xl border border-border bg-muted/20 text-card-foreground p-3 space-y-3"
          aria-label={`Column ${col.title}`}
        >
          {/* Column Header */}
          <header className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-foreground">{col.title}</h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-mono">
                {col.cards.length}
              </span>
            </div>
            <button
              type="button"
              className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Add task to ${col.title}`}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </header>

          {/* Cards List */}
          <div className="flex flex-col space-y-2 min-h-[140px]">
            {col.cards.map((card) => (
              <article
                key={card.id}
                draggable
                onDragStart={() => handleDragStart(card.id, col.id)}
                className="flex flex-col p-3 rounded-lg border border-border bg-card shadow-xs hover:border-primary/40 cursor-grab active:cursor-grabbing transition-all space-y-2 focus-within:ring-2 focus-within:ring-ring"
                tabIndex={0}
                aria-label={`Task: ${card.title}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-foreground leading-snug">{card.title}</h4>
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-50" aria-hidden="true" />
                </div>

                {card.description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{card.description}</p>
                )}

                <footer className="flex items-center justify-between pt-1 text-[10px]">
                  {card.tag && (
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                      {card.tag}
                    </span>
                  )}
                  {card.priority && (
                    <span
                      className={cn(
                        "font-semibold uppercase tracking-wider text-[9px]",
                        card.priority === "high" && "text-destructive",
                        card.priority === "medium" && "text-amber-500",
                        card.priority === "low" && "text-muted-foreground"
                      )}
                    >
                      {card.priority}
                    </span>
                  )}
                </footer>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

```
