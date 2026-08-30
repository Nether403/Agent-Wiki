/**
 * Codemod transformer that upgrades legacy framer-motion imports to modern motion/react (React 19 compatible).
 */
export function transformMotionReact(sourceCode: string): string {
  let transformed = sourceCode;

  // Replace legacy framer-motion imports with motion/react
  transformed = transformed.replace(
    /from\s+["']framer-motion["']/g,
    'from "motion/react"'
  );

  return transformed;
}
