import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const DEFAULT_REGISTRY_HTTP = "http://localhost:3000";
export const REGISTRY_URL_ENV = "DESIGN_WIKI_REGISTRY_URL";

export type RegistryOrigin =
  | { kind: "http"; baseUrl: string }
  | { kind: "file"; rootDir: string };

export interface ResolveRegistryOriginOptions {
  explicit?: string;
  env?: NodeJS.ProcessEnv;
  cwd?: string;
  localRoots?: string[];
}

export function defaultLocalCatalogRoots(cwd: string = process.cwd()): string[] {
  return [
    path.resolve(__dirname, "../../../../apps/docs/public"),
    path.resolve(__dirname, "../../../../packages/registry/dist"),
    path.resolve(cwd, "apps/docs/public"),
    path.resolve(cwd, "packages/registry/dist"),
  ];
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function parseExplicitOrigin(raw: string): RegistryOrigin {
  if (/^https?:\/\//i.test(raw)) {
    return { kind: "http", baseUrl: stripTrailingSlash(raw) };
  }

  let rootDir: string;
  if (raw.startsWith("file://")) {
    const filePath = fileURLToPath(raw);
    rootDir = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
      ? path.dirname(filePath)
      : filePath;
  } else {
    rootDir = path.resolve(raw);
  }

  if (fs.existsSync(rootDir) && fs.statSync(rootDir).isFile()) {
    rootDir = path.dirname(rootDir);
  }

  return { kind: "file", rootDir };
}

function hasCompiledIndex(rootDir: string): boolean {
  return fs.existsSync(path.join(rootDir, "r", "registry.json"));
}

/**
 * Resolve where CLI `add` / `list` should read `/r/*.json`.
 *
 * Priority: `--registry` / explicit arg, then DESIGN_WIKI_REGISTRY_URL,
 * then a compiled local catalog, then http://localhost:3000.
 *
 * An explicit http(s) origin skips local files so a hosted registry can be
 * tested from inside this monorepo.
 */
export function resolveRegistryOrigin(
  options: ResolveRegistryOriginOptions | string | undefined = {}
): RegistryOrigin {
  const opts: ResolveRegistryOriginOptions =
    typeof options === "string" || options === undefined
      ? { explicit: options }
      : options;

  const env = opts.env ?? process.env;
  const cwd = opts.cwd ?? process.cwd();
  const explicit = (opts.explicit ?? "").trim();
  const fromEnv = (env[REGISTRY_URL_ENV] ?? "").trim();
  const chosen = explicit || fromEnv;

  if (chosen) {
    return parseExplicitOrigin(chosen);
  }

  const roots = opts.localRoots ?? defaultLocalCatalogRoots(cwd);
  for (const root of roots) {
    if (hasCompiledIndex(root)) {
      return { kind: "file", rootDir: root };
    }
  }

  return { kind: "http", baseUrl: DEFAULT_REGISTRY_HTTP };
}

export function formatRegistryOrigin(origin: RegistryOrigin): string {
  if (origin.kind === "http") {
    return origin.baseUrl;
  }
  return `file://${origin.rootDir}`;
}

export function registryIndexPath(origin: RegistryOrigin): string {
  if (origin.kind === "http") {
    return `${origin.baseUrl}/r/registry.json`;
  }
  return path.join(origin.rootDir, "r", "registry.json");
}

export function registryItemCandidates(origin: RegistryOrigin, slug: string): string[] {
  const normalized = slug.toLowerCase().trim();
  if (origin.kind === "http") {
    return [`${origin.baseUrl}/r/${normalized}.json`];
  }
  return [
    path.join(origin.rootDir, "r", `${normalized}.json`),
    path.join(origin.rootDir, `${normalized}.json`),
  ];
}
