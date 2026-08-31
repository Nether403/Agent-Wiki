import fs from "fs";
import path from "path";
import {
  formatRegistryOrigin,
  registryIndexPath,
  registryItemCandidates,
  resolveRegistryOrigin,
  type RegistryOrigin,
} from "./registry-origin";

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  a11y: {
    keyboard_navigable: boolean;
    wai_aria_compliant: boolean;
    fallback_provided: boolean;
    reduced_motion_supported?: boolean;
  };
  license_origin?: {
    source_repository: string;
    license_type: string;
    author: string;
  };
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
    target?: string;
  }>;
}

function isRegistryItem(value: unknown): value is RegistryItem {
  if (!value || typeof value !== "object") return false;
  return typeof (value as { name?: unknown }).name === "string";
}

async function readJsonFile(filePath: string): Promise<unknown | null> {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function originFromArg(explicitOrigin?: string): RegistryOrigin {
  return resolveRegistryOrigin(explicitOrigin);
}

/**
 * Fetches the master registry catalog index.
 * Explicit http(s) origins skip local files.
 */
export async function fetchRegistryIndex(explicitOrigin?: string): Promise<RegistryItem[]> {
  const origin = originFromArg(explicitOrigin);

  if (origin.kind === "http") {
    const parsed = await fetchJson(registryIndexPath(origin));
    return Array.isArray(parsed) ? parsed.filter(isRegistryItem) : [];
  }

  const parsed = await readJsonFile(registryIndexPath(origin));
  if (Array.isArray(parsed)) {
    return parsed.filter(isRegistryItem);
  }

  const looseIndex = path.join(origin.rootDir, "registry.json");
  const fallback = await readJsonFile(looseIndex);
  return Array.isArray(fallback) ? fallback.filter(isRegistryItem) : [];
}

/**
 * Fetches a component schema item from the resolved origin only.
 * Explicit http(s) does not fall back to the local monorepo catalog.
 */
export async function fetchComponentItem(
  slug: string,
  explicitOrigin?: string
): Promise<RegistryItem | null> {
  const origin = originFromArg(explicitOrigin);
  const normalizedSlug = slug.toLowerCase().trim();

  if (origin.kind === "http") {
    for (const url of registryItemCandidates(origin, normalizedSlug)) {
      const parsed = await fetchJson(url);
      if (isRegistryItem(parsed)) return parsed;
    }
    const catalog = await fetchRegistryIndex(explicitOrigin);
    return catalog.find((item) => item.name.toLowerCase() === normalizedSlug) ?? null;
  }

  for (const filePath of registryItemCandidates(origin, normalizedSlug)) {
    const parsed = await readJsonFile(filePath);
    if (isRegistryItem(parsed)) return parsed;
  }

  const catalog = await fetchRegistryIndex(explicitOrigin);
  return catalog.find((item) => item.name.toLowerCase() === normalizedSlug) ?? null;
}

export function describeResolvedRegistry(explicitOrigin?: string): string {
  return formatRegistryOrigin(originFromArg(explicitOrigin));
}
