/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Magic UI & Creative Effects AST Transformer:
 * Normalizes legacy Magic UI and Animata components into zero-slop standards:
 * 1. Replaces framer-motion imports with motion/react (React 19 compatible)
 * 2. Maps arbitrary pixel spacing/sizes (h-[400px] -> h-96, p-[17px] -> p-4)
 * 3. Enforces focus-visible replacement on outline-none
 * 4. Ensures prefers-reduced-motion fallback is present on dynamic animation elements
 */

import { transformMotionReact } from "./motion-react-transform";
import { transformTailwindV4 } from "./tailwind-v4-transform";
import { transformReact19 } from "./react-19-transform";

export function transformMagicUI(sourceCode: string): string {
  let transformed = sourceCode;

  // 1. Framer motion to motion/react
  transformed = transformMotionReact(transformed);

  // 2. React 19 forwardRef elimination
  transformed = transformReact19(transformed);

  // 3. Tailwind v4 token mapping & slop elimination
  transformed = transformTailwindV4(transformed);

  // 4. Transform arbitrary height / width pixel escapes commonly in Magic UI
  transformed = transformed.replace(/\bh-\[400px\]/g, "h-96");
  transformed = transformed.replace(/\bh-\[500px\]/g, "h-[32rem]");
  transformed = transformed.replace(/\bh-\[300px\]/g, "h-72");
  transformed = transformed.replace(/\bw-\[400px\]/g, "w-96");
  transformed = transformed.replace(/\bw-\[300px\]/g, "w-72");

  // 5. Fix focus ring suppression without replacement
  transformed = transformed.replace(
    /\boutline-none(?!\s+focus-visible:)/g,
    "outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );

  return transformed;
}
