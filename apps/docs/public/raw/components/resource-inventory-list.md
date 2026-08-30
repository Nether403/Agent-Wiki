---
id: "resource-inventory-list"
name: "Resource Inventory List"
category: "ui:editorial"
library_origin: "https://github.com/Shopify/polaris"
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
  - "table"
  - "inventory"
  - "ecommerce"
  - "admin"
  - "polaris"
  - "antd"
  - "b2b"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Resource Inventory List (`resource-inventory-list`)
> High-density e-commerce / admin resource table with bulk checkbox selection, status badges, contextual filter chips, and pagination.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, table, inventory, ecommerce, admin, polaris, antd, b2b
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add resource-inventory-list

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/resource-inventory-list.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * SPDX-License-Identifier: MIT
 * Source: Machine-First Design Agent Wiki (Inspired by shopify/polaris & ant-design/ant-design)
 * Category: ui:editorial
 * Description: High-density e-commerce / admin resource table with bulk checkbox selection, status badges, contextual filter chips, and pagination.
 */

import * as React from "react";
import { ChevronDown, Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ResourceItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "archived";
}

interface ResourceInventoryListProps {
  items: ResourceItem[];
  onSelectItem?: (ids: string[]) => void;
  className?: string;
}

const statusBadges = {
  in_stock: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  low_stock: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  out_of_stock: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  archived: "bg-muted text-muted-foreground border-border",
};

export function ResourceInventoryList({
  items,
  onSelectItem,
  className,
}: ResourceInventoryListProps) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("all");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const isAllSelected = filteredItems.length > 0 && selectedIds.size === filteredItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
      onSelectItem?.([]);
    } else {
      const next = new Set(filteredItems.map((i) => i.id));
      setSelectedIds(next);
      onSelectItem?.(Array.from(next));
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    onSelectItem?.(Array.from(next));
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Table Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by SKU or name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <span className="text-xs font-mono font-medium text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
              {selectedIds.size} selected
            </span>
          )}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Category</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* High-density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all inventory items"
                  className="rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary"
                />
              </th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="w-10 px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-muted/20 transition-colors",
                    isSelected && "bg-primary/5"
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(item.id)}
                      aria-label={`Select ${item.name}`}
                      className="rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{item.sku}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{item.stock}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border",
                        statusBadges[item.status]
                      )}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Manage ${item.name}`}
                      className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```
