/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Multi-pass AST/regex sanitizer running comprehensive unslop transformations.
 */
import { transformTailwindV4 } from "./tailwind-v4-transform";
import { transformReact19 } from "./react-19-transform";
import { transformMotionReact } from "./motion-react-transform";
import { normalizeLucideIcons } from "./lucide-normalizer";
import { transformDaisyUiToTailwindV4 } from "./daisyui-to-tailwindv4-transform";
import { transformFramerMotionV12 } from "./framer-motion-v12-transform";

export function sanitizeCodeUnslop(sourceCode: string): string {
  let cleaned = sourceCode;

  // 1. Core library modernizations
  cleaned = transformReact19(cleaned);
  cleaned = transformMotionReact(cleaned);
  cleaned = transformFramerMotionV12(cleaned);
  cleaned = transformDaisyUiToTailwindV4(cleaned);
  cleaned = transformTailwindV4(cleaned);
  cleaned = normalizeLucideIcons(cleaned);

  // 2. Remove AI Writing Clichés (SLOP-022)
  cleaned = cleaned.replace(/In today's fast-paced world/gi, "In production environments");
  cleaned = cleaned.replace(/Unleash the power of/gi, "Deploy");
  cleaned = cleaned.replace(/The future is here/gi, "Designed for scale");

  // 3. Remove arbitrary chained type assertions (SLOP-004)
  cleaned = cleaned.replace(/as\s+unknown\s+as\s+([A-Za-z0-9_]+)/g, "as $1");

  // 4. Sanitize empty object spreads (SLOP-005)
  cleaned = cleaned.replace(/\.\.\.\(true\s*\?\s*\{([^}]+)\}\s*:\s*\{\}\)/g, "$1");

  // 5. Replace viewport h-screen with dvh/min-h-screen (SLOP-038)
  cleaned = cleaned.replace(/\bh-screen\b/g, "min-h-[100dvh]");

  return cleaned;
}
