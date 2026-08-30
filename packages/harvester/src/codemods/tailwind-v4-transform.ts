/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Codemod transformer that normalizes legacy Tailwind v3 syntax, arbitrary pixel units,
 * and banned slop patterns to clean, semantic Tailwind v4 tokens.
 */
export function transformTailwindV4(sourceCode: string): string {
  let transformed = sourceCode;

  // 1. Replace hardcoded default indigo colors with semantic primary tokens (SLOP-001)
  transformed = transformed.replace(/\bbg-indigo-600\b/g, "bg-primary");
  transformed = transformed.replace(/\bbg-indigo-500\b/g, "bg-primary/90");
  transformed = transformed.replace(/\btext-indigo-600\b/g, "text-primary");
  transformed = transformed.replace(/\btext-indigo-500\b/g, "text-primary");
  transformed = transformed.replace(/\bborder-indigo-500\b/g, "border-primary");
  transformed = transformed.replace(/\bborder-indigo-600\b/g, "border-primary");

  // 2. Map arbitrary pixel padding/margin/gap escapes to standard Tailwind steps (SLOP-007)
  transformed = transformed.replace(/\bp-\[17px\]/g, "p-4");
  transformed = transformed.replace(/\bp-\[13px\]/g, "p-3");
  transformed = transformed.replace(/\bp-\[15px\]/g, "p-4");
  transformed = transformed.replace(/\bm-\[17px\]/g, "m-4");
  transformed = transformed.replace(/\bm-\[13px\]/g, "m-3");
  transformed = transformed.replace(/\bm-\[15px\]/g, "m-4");
  transformed = transformed.replace(/\bgap-\[17px\]/g, "gap-4");
  transformed = transformed.replace(/\bgap-\[13px\]/g, "gap-3");
  transformed = transformed.replace(/\bgap-\[15px\]/g, "gap-4");

  // 3. Remove arbitrary purple-to-blue linear gradients in favor of clean surfaces (SLOP-002)
  transformed = transformed.replace(
    /\bfrom-purple-500\s+to-blue-500\b/g,
    "from-card to-background border border-border"
  );
  transformed = transformed.replace(
    /\bbg-gradient-to-r\s+from-purple-600\s+to-blue-600\b/g,
    "bg-card border border-border"
  );

  // 4. Remap unconstrained transition-all to targeted transition-colors or transition-transform (SLOP-006)
  transformed = transformed.replace(/\btransition-all\s+duration-300\b/g, "transition-colors duration-200");

  // 5. Replace raw unshaded bg-white / bg-black with semantic tokens (SLOP-021)
  transformed = transformed.replace(/\bbg-white\b(?!\s*\/\s*\d+)/g, "bg-card dark:bg-card");

  return transformed;
}
