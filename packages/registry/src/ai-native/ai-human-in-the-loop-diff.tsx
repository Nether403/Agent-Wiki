/**
 * @license MIT
 * @origin Origin UI / Cult UI (https://originui.com)
 * @author Origin UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Check,
  X,
  Edit3,
  GitCommit,
  FileCode,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export interface DiffLine {
  type: "add" | "delete" | "normal";
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface AiHumanInTheLoopDiffProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName?: string;
  diffLines?: DiffLine[];
  explanation?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onModifyPrompt?: (feedback: string) => void;
}

export function AiHumanInTheLoopDiff({
  fileName = "components/ui/hero-section.tsx",
  diffLines = [
    { type: "normal", oldLineNumber: 12, newLineNumber: 12, content: "export function HeroSection() {" },
    { type: "delete", oldLineNumber: 13, content: "-   return <div className=\"bg-blue-600 p-4\">" },
    { type: "add", newLineNumber: 13, content: "+   return <div className=\"bg-card border border-border p-4\">" },
    { type: "normal", oldLineNumber: 14, newLineNumber: 14, content: "       <h1>Agent Wiki</h1>" },
    { type: "normal", oldLineNumber: 15, newLineNumber: 15, content: "     </div>" },
  ],
  explanation = "Remapped hardcoded indigo colors and arbitrary pixel padding to semantic design tokens (SLOP-001 & SLOP-007 compliant).",
  onApprove,
  onReject,
  onModifyPrompt,
  className,
  ...props
}: AiHumanInTheLoopDiffProps) {
  const [isModifying, setIsModifying] = React.useState(false);
  const [feedbackPrompt, setFeedbackPrompt] = React.useState("");

  const additions = diffLines.filter((l) => l.type === "add").length;
  const deletions = diffLines.filter((l) => l.type === "delete").length;

  const handleApprove = () => {
    onApprove?.();
  };

  const handleReject = () => {
    onReject?.();
  };

  const handleSendFeedback = () => {
    if (!feedbackPrompt.trim()) return;
    onModifyPrompt?.(feedbackPrompt);
    setIsModifying(false);
    setFeedbackPrompt("");
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card text-card-foreground shadow-xl overflow-hidden",
        className
      )}
      role="region"
      aria-label={`Human-in-the-loop review for ${fileName}`}
      {...props}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FileCode className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-foreground">{fileName}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono">
                <span className="text-emerald-500 font-semibold">+{additions}</span>
                <span className="text-destructive font-semibold">-{deletions}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Human Gatekeeper Review</span>
        </div>
      </div>

      {/* Rationale explanation */}
      {explanation && (
        <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center gap-2 text-xs text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
          <span>{explanation}</span>
        </div>
      )}

      {/* Code Diff Display */}
      <div className="overflow-x-auto bg-muted/20 font-mono text-xs max-h-72">
        <table className="w-full border-collapse">
          <tbody>
            {diffLines.map((line, idx) => (
              <tr
                key={idx}
                className={cn(
                  "hover:bg-muted/40 transition-colors",
                  line.type === "add" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  line.type === "delete" && "bg-destructive/10 text-destructive dark:text-destructive-foreground/90"
                )}
              >
                <td className="w-10 px-2 py-0.5 text-right text-muted-foreground/60 select-none border-r border-border/40">
                  {line.oldLineNumber || ""}
                </td>
                <td className="w-10 px-2 py-0.5 text-right text-muted-foreground/60 select-none border-r border-border/40">
                  {line.newLineNumber || ""}
                </td>
                <td className="px-3 py-0.5 whitespace-pre">
                  {line.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modify Feedback Box */}
      {isModifying && (
        <div className="p-4 border-t border-border bg-card space-y-2">
          <label htmlFor="refine-prompt" className="text-xs font-semibold text-foreground">
            Refine Instructions / Request Modifications
          </label>
          <textarea
            id="refine-prompt"
            value={feedbackPrompt}
            onChange={(e) => setFeedbackPrompt(e.target.value)}
            placeholder="Tell the agent what to change (e.g., 'Use rounded-2xl cards instead')..."
            rows={2}
            className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModifying(false)}
              className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendFeedback}
              disabled={!feedbackPrompt.trim()}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Send Refinement
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      {!isModifying && (
        <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-t border-border">
          <button
            type="button"
            onClick={() => setIsModifying(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            Modify Prompt
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Reject Changes
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Approve & Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
