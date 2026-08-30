/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Codemod transformer that migrates Framer Motion syntax to Motion React v12.
 */
export function transformFramerMotionV12(sourceCode: string): string {
  let transformed = sourceCode;

  // 1. Migrate package import from framer-motion to motion/react
  transformed = transformed.replace(
    /from\s+["']framer-motion["']/g,
    'from "motion/react"'
  );

  // 2. Normalize legacy AnimatePresence mode
  transformed = transformed.replace(
    /exitBeforeEnter/g,
    'mode="wait"'
  );

  // 3. Ensure spring damping and stiffness comply with SLOP-028
  transformed = transformed.replace(
    /transition=\{\{\s*type:\s*["']spring["']\s*\}\}/g,
    'transition={{ type: "spring", stiffness: 300, damping: 25 }}'
  );

  return transformed;
}
