/**
 * @license MIT
 * @origin diagram-design (https://diagram.com)
 * @author diagram-design team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface MinimalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  className?: string;
}

export function MinimalTable<T extends Record<string, any>>({
  data,
  columns,
  caption,
  className,
}: MinimalTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border bg-card", className)}>
      <table className="w-full text-left text-sm">
        {caption && (
          <caption className="p-4 text-xs font-medium text-muted-foreground text-left">
            {caption}
          </caption>
        )}
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="transition-colors hover:bg-muted/20 focus-within:bg-muted/30"
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 font-normal text-foreground">
                  {col.render ? col.render(row) : row[col.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
