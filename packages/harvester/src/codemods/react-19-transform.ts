/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * React 19 Codemod Transformer:
 * Strips legacy React.forwardRef / forwardRef wrappers since React 19 natively
 * supports `ref` as a standard prop on function components.
 */

export function transformReact19(sourceCode: string): string {
  let transformed = sourceCode;

  // 1. Transform const Component = React.forwardRef<HTMLElement, Props>(({ ... }, ref) => { ... });
  // to: export function Component({ ref, ...props }: Props) { ... }
  transformed = transformed.replace(
    /const\s+(\w+)\s*=\s*(?:React\.)?forwardRef\s*(?:<[^>]+>)?\s*\(\s*\(\s*\{([^}]+)\}\s*,\s*ref\s*\)\s*=>\s*\{/g,
    "export function $1({ ref, $2 }) {"
  );

  // 2. Transform const Component = React.forwardRef<HTMLElement, Props>((props, ref) => { ... });
  // to: export function Component({ ref, ...props }: Props) { ... }
  transformed = transformed.replace(
    /const\s+(\w+)\s*=\s*(?:React\.)?forwardRef\s*(?:<[^>]+>)?\s*\(\s*\(\s*(\w+)\s*,\s*ref\s*\)\s*=>\s*\{/g,
    "export function $1({ ref, ...$2 }) {"
  );

  // 3. Remove trailing `);` at component closing definition if it came from forwardRef wrapper
  // and remove redundant `Component.displayName = ...`
  transformed = transformed.replace(/(\w+)\.displayName\s*=\s*["'][^"']+["'];?\n?/g, "");

  // 4. Transform default export if wrapped in forwardRef
  transformed = transformed.replace(
    /export\s+default\s+(?:React\.)?forwardRef\s*(?:<[^>]+>)?\s*\(/g,
    "export default ("
  );

  // 5. Clean up redundant React.useMemo with empty dependency array on pure statics
  transformed = transformed.replace(/React\.useMemo\(\(\)\s*=>\s*(\[[^\]]*\]|\{[^}]*\}),\s*\[\]\)/g, "$1");

  return transformed;
}
