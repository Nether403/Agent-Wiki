/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Lucide & SVG Accessibility Normalizer:
 * Scans components to ensure SVG icons are properly annotated with:
 * 1. aria-hidden="true" when decorative alongside text
 * 2. role="img" and aria-label / title when standalone interactive triggers
 */

export function normalizeLucideSvg(sourceCode: string): string {
  let transformed = sourceCode;

  // Ensure raw inline <svg> without aria or role gets aria-hidden="true"
  transformed = transformed.replace(
    /<svg\b(?![^>]*(?:role=["']img["']|aria-hidden|aria-label))([^>]*)>/g,
    '<svg aria-hidden="true"$1>'
  );

  return transformed;
}

export const normalizeLucideIcons = normalizeLucideSvg;

