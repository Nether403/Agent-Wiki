/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Plus, X, Filter, RefreshCw } from "lucide-react";

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface FilterBuilderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  availableFields?: string[];
  onFiltersChange?: (filters: FilterCondition[]) => void;
  onReset?: () => void;
}

const OPERATORS = ["equals", "contains", "greater than", "less than", "starts with"];

export function FilterBuilderToolbar({
  availableFields = ["status", "category", "author", "variance", "motion"],
  onFiltersChange,
  onReset,
  className,
  ...props
}: FilterBuilderToolbarProps) {
  const [filters, setFilters] = React.useState<FilterCondition[]>([
    { id: "1", field: "category", operator: "equals", value: "ui:motion" },
  ]);

  const addCondition = () => {
    const next: FilterCondition = {
      id: Math.random().toString(36).substring(2, 9),
      field: availableFields[0] || "field",
      operator: OPERATORS[0],
      value: "",
    };
    const updated = [...filters, next];
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const removeCondition = (id: string) => {
    const updated = filters.filter((f) => f.id !== id);
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    const updated = filters.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const handleReset = () => {
    setFilters([]);
    onReset?.();
    onFiltersChange?.([]);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl border border-border bg-card shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label="Filter Query Builder"
      {...props}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
          <h4 className="text-xs font-bold text-foreground">Advanced Query Filters</h4>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
            {filters.length} active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addCondition}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Add Condition</span>
          </button>
          {filters.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Reset all filters"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Conditions list */}
      <div className="flex flex-col space-y-2">
        {filters.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">No active filter conditions applied.</p>
        ) : (
          filters.map((f, idx) => (
            <div key={f.id} className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-mono text-muted-foreground w-10">
                {idx === 0 ? "WHERE" : "AND"}
              </span>

              {/* Field selector */}
              <select
                value={f.field}
                onChange={(e) => updateCondition(f.id, { field: e.target.value })}
                className="h-8 px-2 rounded-md border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Select Filter Field"
              >
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>

              {/* Operator selector */}
              <select
                value={f.operator}
                onChange={(e) => updateCondition(f.id, { operator: e.target.value })}
                className="h-8 px-2 rounded-md border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Select Operator"
              >
                {OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              {/* Value Input */}
              <input
                type="text"
                value={f.value}
                onChange={(e) => updateCondition(f.id, { value: e.target.value })}
                placeholder="Filter value..."
                className="h-8 px-3 flex-1 min-w-[120px] rounded-md border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Condition value"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeCondition(f.id)}
                className="p-1 text-muted-foreground hover:text-destructive rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Remove condition"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
