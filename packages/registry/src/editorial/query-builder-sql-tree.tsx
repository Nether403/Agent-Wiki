/**
 * @origin PrimeReact & Ant Design (https://primefaces.org/primereact/querybuilder)
 * @license MIT
 * @author PrimeTek Informatics & Ant Group
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Plus, Trash2, Code2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QueryRule {
  id: string;
  field: string;
  operator: "=" | "!=" | ">" | "<" | "CONTAINS" | "STARTS_WITH";
  value: string;
}

export interface QueryGroup {
  id: string;
  combinator: "AND" | "OR";
  rules: (QueryRule | QueryGroup)[];
}

export interface QueryBuilderSqlTreeProps {
  initialGroup?: QueryGroup;
  fields?: Array<{ label: string; value: string; type: "string" | "number" | "date" }>;
  onChange?: (group: QueryGroup, sql: string) => void;
  className?: string;
}

const DEFAULT_FIELDS = [
  { label: "Status", value: "status", type: "string" as const },
  { label: "Latency (ms)", value: "latency_ms", type: "number" as const },
  { label: "Error Code", value: "error_code", type: "string" as const },
  { label: "Request Count", value: "request_count", type: "number" as const },
  { label: "Created At", value: "created_at", type: "date" as const },
];

function generateSql(group: QueryGroup): string {
  const parts = group.rules.map((rule) => {
    if ("combinator" in rule) {
      const nested = generateSql(rule);
      return nested ? `(${nested})` : "";
    }
    if (!rule.value) return "";
    const val = isNaN(Number(rule.value)) ? `'${rule.value}'` : rule.value;
    if (rule.operator === "CONTAINS") return `${rule.field} LIKE '%${rule.value}%'`;
    if (rule.operator === "STARTS_WITH") return `${rule.field} LIKE '${rule.value}%'`;
    return `${rule.field} ${rule.operator} ${val}`;
  }).filter(Boolean);

  return parts.join(` ${group.combinator} `);
}

export function QueryBuilderSqlTree({
  initialGroup = {
    id: "root",
    combinator: "AND",
    rules: [
      { id: "r1", field: "status", operator: "=", value: "active" },
      { id: "r2", field: "latency_ms", operator: "<", value: "150" },
    ],
  },
  fields = DEFAULT_FIELDS,
  onChange,
  className,
}: QueryBuilderSqlTreeProps) {
  const [rootGroup, setRootGroup] = React.useState<QueryGroup>(initialGroup);
  const [copied, setCopied] = React.useState(false);

  const compiledSql = React.useMemo(() => generateSql(rootGroup), [rootGroup]);

  React.useEffect(() => {
    onChange?.(rootGroup, compiledSql);
  }, [rootGroup, compiledSql, onChange]);

  const addRule = React.useCallback((groupId: string) => {
    setRootGroup((prev) => {
      const updateGroup = (g: QueryGroup): QueryGroup => {
        if (g.id === groupId) {
          const newRule: QueryRule = {
            id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            field: fields[0]?.value || "status",
            operator: "=",
            value: "",
          };
          return { ...g, rules: [...g.rules, newRule] };
        }
        return {
          ...g,
          rules: g.rules.map((r) => ("combinator" in r ? updateGroup(r) : r)),
        };
      };
      return updateGroup(prev);
    });
  }, [fields]);

  const addSubGroup = React.useCallback((groupId: string) => {
    setRootGroup((prev) => {
      const updateGroup = (g: QueryGroup): QueryGroup => {
        if (g.id === groupId) {
          const newGroup: QueryGroup = {
            id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            combinator: "AND",
            rules: [
              {
                id: `r_${Date.now()}`,
                field: fields[0]?.value || "status",
                operator: "=",
                value: "",
              },
            ],
          };
          return { ...g, rules: [...g.rules, newGroup] };
        }
        return {
          ...g,
          rules: g.rules.map((r) => ("combinator" in r ? updateGroup(r) : r)),
        };
      };
      return updateGroup(prev);
    });
  }, [fields]);

  const removeNode = React.useCallback((nodeId: string) => {
    setRootGroup((prev) => {
      const filterGroup = (g: QueryGroup): QueryGroup => ({
        ...g,
        rules: g.rules
          .filter((r) => r.id !== nodeId)
          .map((r) => ("combinator" in r ? filterGroup(r) : r)),
      });
      return filterGroup(prev);
    });
  }, []);

  const updateRule = React.useCallback((ruleId: string, patch: Partial<QueryRule>) => {
    setRootGroup((prev) => {
      const modify = (g: QueryGroup): QueryGroup => ({
        ...g,
        rules: g.rules.map((r) => {
          if ("combinator" in r) return modify(r);
          return r.id === ruleId ? { ...r, ...patch } : r;
        }),
      });
      return modify(prev);
    });
  }, []);

  const updateCombinator = React.useCallback((groupId: string, combinator: "AND" | "OR") => {
    setRootGroup((prev) => {
      const modify = (g: QueryGroup): QueryGroup => {
        if (g.id === groupId) return { ...g, combinator };
        return {
          ...g,
          rules: g.rules.map((r) => ("combinator" in r ? modify(r) : r)),
        };
      };
      return modify(prev);
    });
  }, []);

  const copySql = React.useCallback(async () => {
    if (!compiledSql) return;
    await navigator.clipboard.writeText(compiledSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [compiledSql]);

  const renderGroup = (group: QueryGroup, depth = 0) => (
    <div
      key={group.id}
      className={cn(
        "relative rounded-xl border border-border bg-card p-4 transition-colors duration-200",
        depth > 0 && "ml-4 mt-3 border-dashed bg-muted/30"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Match
          </span>
          <div className="inline-flex rounded-lg border border-border bg-muted/60 p-0.5">
            {(["AND", "OR"] as const).map((comb) => (
              <button
                key={comb}
                type="button"
                onClick={() => updateCombinator(group.id, comb)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  group.combinator === comb
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={group.combinator === comb}
              >
                {comb}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({group.rules.length} {group.rules.length === 1 ? "rule" : "rules"})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => addRule(group.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-3.5 w-3.5" role="img" aria-hidden="true" />
            Add Rule
          </button>
          <button
            type="button"
            onClick={() => addSubGroup(group.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-3.5 w-3.5" role="img" aria-hidden="true" />
            Add Group
          </button>
          {depth > 0 && (
            <button
              type="button"
              onClick={() => removeNode(group.id)}
              aria-label="Remove group"
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" role="img" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5 pt-3">
        {group.rules.map((rule) => {
          if ("combinator" in rule) {
            return renderGroup(rule, depth + 1);
          }
          return (
            <div
              key={rule.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-sm"
            >
              <select
                value={rule.field}
                onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                className="h-8 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Filter Field"
              >
                {fields.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              <select
                value={rule.operator}
                onChange={(e) =>
                  updateRule(rule.id, {
                    operator: e.target.value as QueryRule["operator"],
                  })
                }
                className="h-8 rounded-md border border-border bg-card px-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Filter Operator"
              >
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="CONTAINS">contains</option>
                <option value="STARTS_WITH">starts with</option>
              </select>

              <input
                type="text"
                value={rule.value}
                placeholder="Enter value..."
                onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                className="h-8 min-w-[140px] flex-1 rounded-md border border-border bg-card px-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Rule value"
              />

              <button
                type="button"
                onClick={() => removeNode(rule.id)}
                aria-label="Delete rule"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" role="img" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn("w-full space-y-4 rounded-xl border border-border bg-background p-5 shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Structured SQL Query Builder
          </h3>
          <p className="text-xs text-muted-foreground">
            Visual rule tree generator for complex database filters and telemetry queries.
          </p>
        </div>
      </div>

      {renderGroup(rootGroup)}

      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <div className="flex items-center justify-between pb-1.5">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Code2 className="h-3.5 w-3.5 text-primary" role="img" aria-hidden="true" />
            Generated SQL WHERE Clause
          </span>
          <button
            type="button"
            onClick={copySql}
            disabled={!compiledSql}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" role="img" aria-hidden="true" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" role="img" aria-hidden="true" /> Copy SQL
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto font-mono text-xs text-foreground/90 whitespace-pre-wrap">
          {compiledSql || <span className="text-muted-foreground italic">WHERE true (No active filters)</span>}
        </pre>
      </div>
    </div>
  );
}
