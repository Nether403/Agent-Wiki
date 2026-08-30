/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { GitBranch, GitCommit, GitMerge, FileCode, Check, AlertCircle } from "lucide-react";

export interface CommitNode {
  id: string;
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  status: "clean" | "conflict" | "merged";
  filesChanged: number;
}

export interface BranchDiffTreeInspectorProps {
  branchName?: string;
  baseBranch?: string;
  commits?: CommitNode[];
  className?: string;
}

export function BranchDiffTreeInspector({
  branchName = "feature/screened-gems-ingest",
  baseBranch = "main",
  commits = [
    { id: "1", sha: "7fa29c1", message: "feat: add 47 screened repositories into harvester catalog", author: "Antigravity Agent", timestamp: "10m ago", status: "clean", filesChanged: 3 },
    { id: "2", sha: "3cd408f", message: "codemod: implement screenshot-unslop AST normalizer", author: "Antigravity Agent", timestamp: "6m ago", status: "clean", filesChanged: 2 },
    { id: "3", sha: "e901ab2", message: "a11y: inject WCAG 2.1 AA luminance contrast checker", author: "Antigravity Agent", timestamp: "2m ago", status: "merged", filesChanged: 4 },
  ],
  className = "",
}: BranchDiffTreeInspectorProps) {
  const [selectedSha, setSelectedSha] = useState<string>(commits[0]?.sha || "");

  const activeCommit = commits.find((c) => c.sha === selectedSha);

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm " + className}>
      {/* Branch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <GitBranch className="w-4 h-4" role="img" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground font-mono">{branchName}</span>
              <span className="text-xs text-muted-foreground font-mono">into {baseBranch}</span>
            </div>
            <span className="text-xs text-muted-foreground">3 commits ahead of base</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
          <Check className="w-3.5 h-3.5" role="img" aria-hidden="true" />
          Able to Merge
        </span>
      </div>

      {/* Commit Tree List */}
      <div className="divide-y divide-border my-3">
        {commits.map((commit) => {
          const isSelected = commit.sha === selectedSha;
          return (
            <div
              key={commit.sha}
              onClick={() => setSelectedSha(commit.sha)}
              className={
                "p-3 rounded-lg flex items-center justify-between gap-4 cursor-pointer transition-colors " +
                (isSelected ? "bg-muted text-foreground" : "hover:bg-muted/40 text-foreground/80")
              }
            >
              <div className="flex items-center gap-3">
                <GitCommit className="w-4 h-4 text-muted-foreground shrink-0" role="img" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">{commit.message}</p>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-0.5">
                    <span className="bg-background px-1.5 py-0.5 rounded border border-border">{commit.sha}</span>
                    <span>{commit.author}</span>
                    <span>•</span>
                    <span>{commit.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-muted-foreground">
                <FileCode className="w-3.5 h-3.5" role="img" aria-hidden="true" />
                <span>{commit.filesChanged} files</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Diff Inspector */}
      {activeCommit && (
        <div className="mt-3 p-3.5 rounded-lg bg-background border border-border">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1.5">
            <span>COMMIT DETAIL // {activeCommit.sha}</span>
            <span>Status: {activeCommit.status.toUpperCase()}</span>
          </div>
          <p className="text-xs text-foreground font-mono">{activeCommit.message}</p>
        </div>
      )}
    </div>
  );
}
