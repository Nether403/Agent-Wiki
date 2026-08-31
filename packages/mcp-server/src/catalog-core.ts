import fs from "fs";
import path from "path";

export const CATALOG_CORE_FILE = "catalog-core.json";
export const SEARCH_RETURN_LIMIT = 24;

export type CatalogTier = "core" | "experimental";
export type CatalogTierFilter = CatalogTier | "all";

interface CatalogCoreFile {
  slugs?: string[];
}

function coreCandidatePaths(): string[] {
  return [
    path.resolve(__dirname, "../catalog/catalog-core.json"),
    path.resolve(__dirname, "../../../../catalog-core.json"),
    path.resolve(process.cwd(), "catalog-core.json"),
    path.resolve(process.cwd(), "../../catalog-core.json"),
  ];
}

let cachedSlugs: Set<string> | null = null;

export function loadCatalogCoreSlugs(): Set<string> {
  if (cachedSlugs) return cachedSlugs;

  for (const candidate of coreCandidatePaths()) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(candidate, "utf-8")) as CatalogCoreFile;
      if (Array.isArray(parsed.slugs) && parsed.slugs.length > 0) {
        cachedSlugs = new Set(parsed.slugs);
        return cachedSlugs;
      }
    } catch {
      // try the next path
    }
  }

  cachedSlugs = new Set();
  return cachedSlugs;
}

export function catalogTier(slug: string, core: Set<string> = loadCatalogCoreSlugs()): CatalogTier {
  return core.has(slug) ? "core" : "experimental";
}

export function resolveSearchScope(options: {
  query?: string;
  category?: string;
  tier?: CatalogTierFilter;
}): CatalogTierFilter {
  if (options.tier) return options.tier;
  const hasQuery = Boolean(options.query && options.query.trim());
  if (!hasQuery && !options.category) return "core";
  return "all";
}

export function applyCatalogTier<T extends { name: string }>(
  items: T[],
  scope: CatalogTierFilter,
  core: Set<string> = loadCatalogCoreSlugs()
): Array<T & { tier: CatalogTier }> {
  const tagged = items.map((item) => ({
    ...item,
    tier: catalogTier(item.name, core),
  }));

  const filtered =
    scope === "all" ? tagged : tagged.filter((item) => item.tier === scope);

  filtered.sort((a, b) => {
    if (a.tier === b.tier) return 0;
    return a.tier === "core" ? -1 : 1;
  });

  return filtered;
}
