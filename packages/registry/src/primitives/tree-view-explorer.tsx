/**
 * @license MIT
 * @origin Shark UI / ReUI (https://reui.io)
 * @author Shark UI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronRight, Folder, FolderOpen, FileCode, FileText, File } from "lucide-react";

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
  iconType?: "code" | "text" | "default";
}

export interface TreeViewExplorerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeNode[];
  selectedId?: string;
  onSelectNode?: (node: TreeNode) => void;
  defaultExpandedIds?: string[];
}

export function TreeViewExplorer({
  data = [
    {
      id: "root",
      name: "src",
      type: "folder",
      children: [
        {
          id: "components",
          name: "components",
          type: "folder",
          children: [
            { id: "button", name: "button.tsx", type: "file", iconType: "code" },
            { id: "dialog", name: "dialog.tsx", type: "file", iconType: "code" },
          ],
        },
        { id: "index", name: "index.ts", type: "file", iconType: "code" },
        { id: "readme", name: "README.md", type: "file", iconType: "text" },
      ],
    },
  ],
  selectedId,
  onSelectNode,
  defaultExpandedIds = ["root", "components"],
  className,
  ...props
}: TreeViewExplorerProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    new Set(defaultExpandedIds)
  );
  const [currentSelectedId, setCurrentSelectedId] = React.useState<string | undefined>(
    selectedId
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (node: TreeNode) => {
    setCurrentSelectedId(node.id);
    if (node.type === "folder") {
      toggleExpand(node.id);
    }
    onSelectNode?.(node);
  };

  const renderTree = (nodes: TreeNode[], depth: number = 0) => {
    return (
      <ul role={depth === 0 ? "tree" : "group"} className="space-y-0.5">
        {nodes.map((node) => {
          const isExpanded = expandedIds.has(node.id);
          const isSelected = currentSelectedId === node.id;
          const isFolder = node.type === "folder";

          return (
            <li key={node.id} role="treeitem" aria-expanded={isFolder ? isExpanded : undefined}>
              <button
                type="button"
                onClick={() => handleSelect(node)}
                style={{ paddingLeft: `${depth * 14 + 8}px` }}
                className={cn(
                  "flex items-center gap-2 w-full py-1.5 pr-3 rounded-lg text-xs font-medium text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {isFolder ? (
                  <>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 shrink-0",
                        isExpanded && "rotate-90",
                        isSelected && "text-primary-foreground"
                      )}
                      aria-hidden="true"
                    />
                    {isExpanded ? (
                      <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
                    ) : (
                      <Folder className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
                    )}
                  </>
                ) : (
                  <>
                    <span className="w-3.5 shrink-0" />
                    {node.iconType === "code" ? (
                      <FileCode className="h-4 w-4 text-blue-500 shrink-0" aria-hidden="true" />
                    ) : node.iconType === "text" ? (
                      <FileText className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                    ) : (
                      <File className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                    )}
                  </>
                )}
                <span className="truncate">{node.name}</span>
              </button>

              {isFolder && isExpanded && node.children && (
                <div className="mt-0.5">
                  {renderTree(node.children, depth + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-3 shadow-xs select-none",
        className
      )}
      role="region"
      aria-label="Hierarchical File Tree Explorer"
      {...props}
    >
      {renderTree(data, 0)}
    </div>
  );
}
