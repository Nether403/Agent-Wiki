/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Codemod transformer that normalizes daisyUI component utility classes
 * into clean, native Tailwind CSS v4 variables and semantic tokens.
 */
export function transformDaisyUiToTailwindV4(sourceCode: string): string {
  let transformed = sourceCode;

  // 1. Button mappings
  transformed = transformed.replace(/\bbtn-primary\b/g, "bg-primary text-primary-foreground hover:bg-primary/90");
  transformed = transformed.replace(/\bbtn-secondary\b/g, "bg-secondary text-secondary-foreground hover:bg-secondary/80");
  transformed = transformed.replace(/\bbtn-accent\b/g, "bg-accent text-accent-foreground hover:bg-accent/80");
  transformed = transformed.replace(/\bbtn-ghost\b/g, "hover:bg-muted text-foreground");
  transformed = transformed.replace(/\bbtn-outline\b/g, "border border-border bg-transparent hover:bg-muted");
  transformed = transformed.replace(/\bbtn\b/g, "inline-flex items-center justify-center rounded-md text-xs font-semibold px-3 py-2 transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring");

  // 2. Card mappings
  transformed = transformed.replace(/\bcard-body\b/g, "p-6 flex flex-col gap-2");
  transformed = transformed.replace(/\bcard-title\b/g, "text-base font-bold text-foreground");
  transformed = transformed.replace(/\bcard-actions\b/g, "mt-4 flex items-center justify-end gap-2");
  transformed = transformed.replace(/\bcard\b/g, "rounded-xl border border-border bg-card text-card-foreground shadow-xs");

  // 3. Badge mappings
  transformed = transformed.replace(/\bbadge-primary\b/g, "bg-primary/10 text-primary border-primary/20");
  transformed = transformed.replace(/\bbadge-outline\b/g, "border border-border text-muted-foreground");
  transformed = transformed.replace(/\bbadge\b/g, "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono font-medium");

  // 4. DaisyUI alert & feedback
  transformed = transformed.replace(/\balert-info\b/g, "bg-muted text-foreground border-border");
  transformed = transformed.replace(/\balert-success\b/g, "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20");
  transformed = transformed.replace(/\balert\b/g, "flex items-center gap-3 rounded-lg border p-4 text-xs");

  return transformed;
}
