/**
 * @origin Machine-First Design Agent Wiki (Enterprise Cloudscape Archetype)
 * @license MIT
 * @curated-by Antigravity & manus-research
 */
"use client";

import React, { useState, useId } from "react";
import { Plus, Trash2, Filter, ChevronRight, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export type QueryOperator = "equals" | "contains" | "starts_with" | "greater_than" | "less_than" | "in_list";
export type LogicalOperator = "AND" | "OR";

export interface QueryRule {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string;
}

export interface QueryGroup {
  id: string;
  logicalOperator: LogicalOperator;
  rules: QueryRule[];
}

export interface FacetedQueryBuilderProps {
  availableFields?: Array<{ key: string; label: string; type: "string" | "number" | "enum" }>;
  initialQuery?: QueryGroup;
  onQueryChange?: (query: QueryGroup) => void;
  className?: string;
}

const DEFAULT_FIELDS = [
  { key: "status", label: "Workflow Status", type: "enum" as const },
  { key: "latency", label: "Response Latency (ms)", type: "number" as const },
  { key: "model", label: "AI Model ID", type: "string" as const },
  { key: "tokens", label: "Token Consumption", type: "number" as const },
  { key: "author", label: "Session Author", type: "string" as const },
];

const OPERATORS_BY_TYPE: Record<string, Array<{ key: QueryOperator; label: string }>> = {
  string: [
    { key: "equals", label: "is equal to" },
    { key: "contains", label: "contains" },
    { key: "starts_with", label: "starts with" },
  ],
  number: [
    { key: "equals", label: "==" },
    { key: "greater_than", label: ">" },
    { key: "less_than", label: "<" },
  ],
  enum: [
    { key: "equals", label: "is" },
    { key: "in_list", label: "is one of" },
  ],
};

export function FacetedQueryBuilder({
  availableFields = DEFAULT_FIELDS,
  initialQuery,
  onQueryChange,
  className,
}: FacetedQueryBuilderProps) {
  const baseId = useId();
  const [query, setQuery] = useState<QueryGroup>(
    initialQuery ?? {
      id: "root-group",
      logicalOperator: "AND",
      rules: [
        { id: "rule-1", field: "status", operator: "equals", value: "active" },
        { id: "rule-2", field: "tokens", operator: "greater_than", value: "1500" },
      ],
    }
  );

  const updateRule = (ruleId: string, updates: Partial<QueryRule>) => {
    const updatedRules = query.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule));
    const nextQuery = { ...query, rules: updatedRules };
    setQuery(nextQuery);
    onQueryChange?.(nextQuery);
  };

  const addRule = () => {
    const defaultField = availableFields[0]?.key || "status";
    const nextRule: QueryRule = {
      id: `rule-${Date.now()}`,
      field: defaultField,
      operator: "equals",
      value: "",
    };
    const nextQuery = { ...query, rules: [...query.rules, nextRule] };
    setQuery(nextQuery);
    onQueryChange?.(nextQuery);
  };

  const removeRule = (ruleId: string) => {
    if (query.rules.length <= 1) return;
    const nextQuery = { ...query, rules: query.rules.filter((r) => r.id !== ruleId) };
    setQuery(nextQuery);
    onQueryChange?.(nextQuery);
  };

  const toggleLogicalOperator = () => {
    const nextOp: LogicalOperator = query.logicalOperator === "AND" ? "OR" : "AND";
    const nextQuery = { ...query, logicalOperator: nextOp };
    setQuery(nextQuery);
    onQueryChange?.(nextQuery);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-colors",
        className
      )}
      role="region"
      aria-label="Faceted Query Condition Builder"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Filter className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Faceted Query Filter</h3>
            <p className="text-xs text-muted-foreground">Construct compound multi-field filter rules</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Match Condition:</span>
          <button
            type="button"
            onClick={toggleLogicalOperator}
            aria-label={`Match condition currently ${query.logicalOperator}. Click to toggle.`}
            className="inline-flex h-7 items-center rounded-md border border-border bg-muted px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {query.logicalOperator === "AND" ? "ALL (AND)" : "ANY (OR)"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3" role="list" aria-label="Active Filter Conditions">
        {query.rules.map((rule, index) => {
          const fieldDef = availableFields.find((f) => f.key === rule.field) || availableFields[0];
          const operators = OPERATORS_BY_TYPE[fieldDef?.type || "string"] || OPERATORS_BY_TYPE.string;

          return (
            <div
              key={rule.id}
              role="listitem"
              className="flex flex-col gap-2 rounded-lg border border-border/80 bg-background/50 p-3 transition-colors sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <label htmlFor={`${baseId}-field-${rule.id}`} className="sr-only">
                  Select query field
                </label>
                <select
                  id={`${baseId}-field-${rule.id}`}
                  value={rule.field}
                  onChange={(e) => updateRule(rule.id, { field: e.target.value, operator: "equals" })}
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {availableFields.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <label htmlFor={`${baseId}-op-${rule.id}`} className="sr-only">
                  Select comparison operator
                </label>
                <select
                  id={`${baseId}-op-${rule.id}`}
                  value={rule.operator}
                  onChange={(e) => updateRule(rule.id, { operator: e.target.value as QueryOperator })}
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {operators.map((op) => (
                    <option key={op.key} value={op.key}>
                      {op.label}
                    </option>
                  ))}
                </select>

                <label htmlFor={`${baseId}-val-${rule.id}`} className="sr-only">
                  Query filter value
                </label>
                <input
                  id={`${baseId}-val-${rule.id}`}
                  type="text"
                  value={rule.value}
                  placeholder="Enter comparison value..."
                  onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                  className="h-8 flex-1 rounded-md border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                <button
                  type="button"
                  onClick={() => removeRule(rule.id)}
                  disabled={query.rules.length <= 1}
                  aria-label={`Remove rule ${index + 1}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Condition Rule
        </button>

        <span className="text-[11px] text-muted-foreground" aria-live="polite">
          {query.rules.length} active {query.rules.length === 1 ? "rule" : "rules"} applied
        </span>
      </div>
    </div>
  );
}
