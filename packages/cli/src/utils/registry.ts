import fs from "fs";
import path from "path";

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

/**
 * Fetches the master registry catalog index
 */
export async function fetchRegistryIndex(baseUrl: string = "http://localhost:3000"): Promise<RegistryItem[]> {
  // 1. Try local filesystem paths first (fastest, works offline in workspace)
  const localPaths = [
    path.resolve(__dirname, "../../../apps/docs/public/r/registry.json"),
    path.resolve(__dirname, "../../registry/dist/r/registry.json"),
    path.resolve(process.cwd(), "apps/docs/public/r/registry.json"),
    path.resolve(process.cwd(), "packages/registry/dist/r/registry.json"),
  ];

  for (const p of localPaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch {
        // Fall through
      }
    }
  }

  // 2. Fetch over HTTP
  try {
    const url = `${baseUrl.replace(/\/$/, "")}/r/registry.json`;
    const res = await fetch(url);
    if (res.ok) {
      return (await res.json()) as RegistryItem[];
    }
  } catch {
    // Fall through
  }

  return [];
}

/**
 * Fetches a specific component schema item from local files or remote registry
 */
export async function fetchComponentItem(
  slug: string,
  baseUrl: string = "http://localhost:3000"
): Promise<RegistryItem | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Check local files in workspace
  const localPaths = [
    path.resolve(__dirname, `../../../apps/docs/public/r/${normalizedSlug}.json`),
    path.resolve(__dirname, `../../registry/dist/r/${normalizedSlug}.json`),
    path.resolve(process.cwd(), `apps/docs/public/r/${normalizedSlug}.json`),
    path.resolve(process.cwd(), `packages/registry/dist/r/${normalizedSlug}.json`),
  ];

  for (const p of localPaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch {
        // Fall through
      }
    }
  }

  // 2. Try HTTP fetch
  try {
    const url = `${baseUrl.replace(/\/$/, "")}/r/${normalizedSlug}.json`;
    const res = await fetch(url);
    if (res.ok) {
      return (await res.json()) as RegistryItem;
    }
  } catch {
    // Fall through
  }

  // 3. Fallback: Search in master registry if already loaded
  const catalog = await fetchRegistryIndex(baseUrl);
  const match = catalog.find((i) => i.name.toLowerCase() === normalizedSlug);
  return match || null;
}
