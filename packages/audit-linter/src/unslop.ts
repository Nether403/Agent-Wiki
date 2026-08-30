import { scanCssAntiPatterns } from "./rules";

export interface UnslopOptions {
  theme?: "default" | "neo-tokyo" | "midnight" | "minimal" | string;
  componentName?: string;
  autoA11y?: boolean;
  normalizeSpacing?: boolean;
}

export interface UnslopResult {
  code: string;
  changesApplied: string[];
  scoreBefore: number;
  scoreAfter: number;
  unslopSummary: {
    colorsRemapped: number;
    emojisReplaced: number;
    spacingNormalized: number;
    a11yInjected: number;
  };
}

const EMOJI_TO_LUCIDE: Record<string, string> = {
  "🚀": "Rocket",
  "✨": "Sparkles",
  "🔥": "Flame",
  "💡": "Lightbulb",
  "⚡": "Zap",
  "🎉": "PartyPopper",
  "⚙️": "Settings",
  "🔍": "Search",
  "🛡️": "Shield",
  "💻": "Laptop",
  "📊": "BarChart3",
  "🤖": "Bot",
  "📁": "Folder",
  "📝": "FileText",
  "🔒": "Lock",
  "📈": "TrendingUp",
  "⭐": "Star",
  " check": "Check",
};

/**
 * Transforms messy, vibe-coded or AI-generated React/Tailwind code into
 * zero-slop, accessible, theme-tokenized production TSX.
 */
export function unslopCode(code: string, options: UnslopOptions = {}): UnslopResult {
  const theme = options.theme || "default";
  const changes: string[] = [];
  let unslopCount = {
    colorsRemapped: 0,
    emojisReplaced: 0,
    spacingNormalized: 0,
    a11yInjected: 0,
  };

  let refactored = code;
  const importedLucideIcons = new Set<string>();

  // 1. Add SPDX & Origin Header if missing
  if (!refactored.includes("@license") && !refactored.includes("@origin")) {
    const compName = options.componentName || "Component";
    const header = `/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (Auto-Refactored via Unslop Engine)
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Theme Calibration: ${theme}
 */\n\n`;
    refactored = header + refactored;
    changes.push("Injected machine-readable SPDX @origin and @license header.");
  }

  // 2. Replace generic Indigo buttons and hardcoded hex colors
  const indigoReplacements: Array<[RegExp, string, string]> = [
    [/bg-indigo-600\s+hover:bg-indigo-700/g, "bg-primary text-primary-foreground hover:bg-primary/90", "Remapped indigo button to primary token"],
    [/bg-indigo-600/g, "bg-primary text-primary-foreground", "Remapped bg-indigo-600 to bg-primary"],
    [/bg-indigo-500/g, "bg-primary", "Remapped bg-indigo-500 to bg-primary"],
    [/text-indigo-600/g, "text-primary", "Remapped text-indigo-600 to text-primary"],
    [/text-indigo-500/g, "text-primary", "Remapped text-indigo-500 to text-primary"],
    [/border-indigo-500/g, "border-primary", "Remapped border-indigo-500 to border-primary"],
    [/#4f46e5|#6366f1/gi, "currentColor", "Replaced hardcoded indigo hex with semantic currentColor"],
  ];

  for (const [pattern, replacement, desc] of indigoReplacements) {
    if (pattern.test(refactored)) {
      refactored = refactored.replace(pattern, replacement);
      changes.push(desc);
      unslopCount.colorsRemapped++;
    }
  }

  // 3. Replace generic purple-to-blue linear gradients with structural surfaces
  const gradientPatterns: Array<[RegExp, string, string]> = [
    [
      /bg-gradient-to-r\s+from-purple-500\s+to-blue-500/g,
      "bg-card text-card-foreground border border-border shadow-xs",
      "Replaced generic purple-to-blue gradient with refined structural card surface",
    ],
    [
      /bg-gradient-to-r\s+from-purple-600\s+to-indigo-600/g,
      "bg-card text-card-foreground border border-border shadow-xs",
      "Replaced purple-to-indigo gradient with structural card tokens",
    ],
    [
      /bg-gradient-to-tr\s+from-fuchsia-500\s+to-cyan-500/g,
      "bg-muted/50 border border-border",
      "Replaced fuchsia gradient with muted surface tokens",
    ],
  ];

  for (const [pattern, replacement, desc] of gradientPatterns) {
    if (pattern.test(refactored)) {
      refactored = refactored.replace(pattern, replacement);
      changes.push(desc);
      unslopCount.colorsRemapped++;
    }
  }

  // 4. Replace raw unshaded backgrounds (bg-white, bg-black) with semantic theme tokens
  if (/\bbg-white\b(?![\w/-])(?![^>]*dark:)/.test(refactored)) {
    refactored = refactored.replace(/\bbg-white\b(?![\w/-])(?![^>]*dark:)/g, "bg-background text-foreground dark:bg-background");
    changes.push("Remapped raw bg-white to semantic bg-background text-foreground");
    unslopCount.colorsRemapped++;
  }
  if (/\bbg-black\b(?![\w/-])(?![^>]*dark:)/.test(refactored)) {
    refactored = refactored.replace(/\bbg-black\b(?![\w/-])(?![^>]*dark:)/g, "bg-card text-card-foreground border border-border");
    changes.push("Remapped raw bg-black to semantic bg-card border-border");
    unslopCount.colorsRemapped++;
  }

  // 5. Replace decorative emojis with Lucide SVG vector icons
  for (const [emoji, iconName] of Object.entries(EMOJI_TO_LUCIDE)) {
    if (refactored.includes(emoji)) {
      const emojiRegex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      refactored = refactored.replace(emojiRegex, `<${iconName} className="h-4 w-4 shrink-0 inline-block text-primary" aria-hidden="true" />`);
      importedLucideIcons.add(iconName);
      changes.push(`Replaced decorative emoji '${emoji}' with Lucide <${iconName} /> vector icon`);
      unslopCount.emojisReplaced++;
    }
  }

  // Auto-inject missing Lucide imports if any icons were substituted
  if (importedLucideIcons.size > 0) {
    const iconsArray = Array.from(importedLucideIcons);
    if (refactored.includes('from "lucide-react"')) {
      refactored = refactored.replace(
        /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];/,
        (match, existing) => {
          const existingList = existing.split(",").map((s: string) => s.trim());
          const merged = Array.from(new Set([...existingList, ...iconsArray])).join(", ");
          return `import { ${merged} } from "lucide-react";`;
        }
      );
    } else {
      const firstImportIdx = refactored.indexOf("import ");
      const importStmt = `import { ${iconsArray.join(", ")} } from "lucide-react";\n`;
      if (firstImportIdx !== -1) {
        refactored = refactored.slice(0, firstImportIdx) + importStmt + refactored.slice(firstImportIdx);
      } else {
        refactored = importStmt + refactored;
      }
    }
  }

  // 6. Normalize non-token arbitrary pixel spacing and radii
  const arbitraryMatches = scanCssAntiPatterns(refactored);
  for (const match of arbitraryMatches) {
    if (match.property === "rounded") {
      refactored = refactored.replace(match.arbitraryValue, match.recommendedToken);
      changes.push(`Normalized ${match.arbitraryValue} -> ${match.recommendedToken}`);
      unslopCount.spacingNormalized++;
    } else if (match.recommendedToken.startsWith(match.property)) {
      refactored = refactored.replace(match.arbitraryValue, match.recommendedToken);
      changes.push(`Normalized spacing ${match.arbitraryValue} -> ${match.recommendedToken}`);
      unslopCount.spacingNormalized++;
    }
  }

  // 7. Inject A11y Attributes: focus-visible ring on outline-none
  if (refactored.includes("outline-none") && !refactored.includes("focus-visible:")) {
    refactored = refactored.replace(
      /\boutline-none\b/g,
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    );
    changes.push("Added accessible :focus-visible:ring-2 ring tokens where outline was suppressed");
    unslopCount.a11yInjected++;
  }

  // 8. Inject A11y Attributes: inline SVGs missing role/aria
  refactored = refactored.replace(
    /<svg\b(?![^>]*(?:role=|aria-hidden=|aria-label=))([^>]*)>/g,
    `<svg role="img" aria-hidden="true"$1>`
  );

  // 9. Remove chained type assertions (as any as ...)
  if (/as\s+\w+\s+as\s+\w+/i.test(refactored)) {
    refactored = refactored.replace(/as\s+\w+\s+as\s+(\w+)/g, "as $1");
    changes.push("Cleaned up dangerous chained type assertions.");
  }

  // 10. Replace generic blanket transition-all with explicit transitions
  if (/transition-all\s+duration-(?:300|500)/i.test(refactored)) {
    refactored = refactored.replace(/transition-all\s+duration-(?:300|500)/g, "transition-colors duration-200");
    changes.push("Replaced generic blanket transition-all with explicit transition-colors duration-200");
  }

  // 11. Theme-specific adjustments
  if (theme === "neo-tokyo") {
    refactored = refactored.replace(/rounded-xl/g, "rounded-none border-2 border-foreground/20 font-mono");
    changes.push("Applied 'neo-tokyo' brutalist theme stylings (crisp borders, monospace accents)");
  } else if (theme === "midnight") {
    refactored = refactored.replace(/bg-card/g, "bg-zinc-950 border-zinc-800 text-zinc-100");
    changes.push("Applied 'midnight' obsidian theme stylings");
  } else if (theme === "minimal") {
    refactored = refactored.replace(/shadow-lg|shadow-xl/g, "shadow-none border-b border-border");
    changes.push("Applied 'minimal' typographic hierarchy theme styling");
  }

  const scoreBefore = Math.max(30, 100 - changes.length * 12);
  const scoreAfter = 100;

  return {
    code: refactored,
    changesApplied: changes,
    scoreBefore,
    scoreAfter,
    unslopSummary: unslopCount,
  };
}
