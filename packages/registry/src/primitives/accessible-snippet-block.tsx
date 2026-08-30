/**
 * @license MIT
 * @origin HeroUI (https://heroui.com)
 * @author HeroUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Check, Copy, Terminal } from "lucide-react";

export interface SnippetCommands {
  npm?: string;
  pnpm?: string;
  yarn?: string;
  bun?: string;
}

export interface AccessibleSnippetBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  packageSlug: string;
  customCommands?: SnippetCommands;
}

export function AccessibleSnippetBlock({
  packageSlug = "design-wiki add button",
  customCommands,
  className,
  ...props
}: AccessibleSnippetBlockProps) {
  const [selectedPm, setSelectedPm] = React.useState<"pnpm" | "npm" | "yarn" | "bun">("pnpm");
  const [hasCopied, setHasCopied] = React.useState(false);

  const commands: Record<string, string> = {
    pnpm: customCommands?.pnpm || `pnpm dlx ${packageSlug}`,
    npm: customCommands?.npm || `npx ${packageSlug}`,
    yarn: customCommands?.yarn || `yarn dlx ${packageSlug}`,
    bun: customCommands?.bun || `bunx --bun ${packageSlug}`,
  };

  const activeCommand = commands[selectedPm];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCommand);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Graceful fallback
    }
  };

  return (
    <div
      className={cn("w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs", className)}
      role="region"
      aria-label="Code installation snippet"
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Package managers">
          {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
            <button
              key={pm}
              role="tab"
              aria-selected={selectedPm === pm}
              onClick={() => setSelectedPm(pm)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedPm === pm
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {pm}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={hasCopied ? "Command copied" : "Copy installation command to clipboard"}
        >
          {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{hasCopied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="flex items-center gap-3 p-4 font-mono text-xs sm:text-sm text-foreground overflow-x-auto">
        <Terminal className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <code className="select-all">{activeCommand}</code>
      </div>
    </div>
  );
}
