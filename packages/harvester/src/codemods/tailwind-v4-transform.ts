/**
 * Codemod transformer that normalizes legacy Tailwind v3 syntax and arbitrary units
 * to clean, semantic Tailwind v4 tokens.
 */
export function transformTailwindV4(sourceCode: string): string {
  let transformed = sourceCode;

  // 1. Replace hardcoded default indigo colors with semantic primary tokens
  transformed = transformed.replace(/bg-indigo-600/g, "bg-primary");
  transformed = transformed.replace(/bg-indigo-500/g, "bg-primary/90");
  transformed = transformed.replace(/text-indigo-600/g, "text-primary");
  transformed = transformed.replace(/text-indigo-500/g, "text-primary");
  transformed = transformed.replace(/border-indigo-500/g, "border-primary");

  // 2. Map arbitrary pixel padding/margin escapes to standard steps
  transformed = transformed.replace(/p-\[17px\]/g, "p-4");
  transformed = transformed.replace(/p-\[13px\]/g, "p-3");
  transformed = transformed.replace(/m-\[17px\]/g, "m-4");
  transformed = transformed.replace(/m-\[13px\]/g, "m-3");
  transformed = transformed.replace(/gap-\[17px\]/g, "gap-4");

  // 3. Remove arbitrary purple-to-blue linear gradients in favor of clean surfaces
  transformed = transformed.replace(
    /from-purple-500\s+to-blue-500/g,
    "from-card to-background border border-border"
  );

  return transformed;
}
