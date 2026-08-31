import { describeResolvedRegistry, fetchRegistryIndex, RegistryItem } from "../utils/registry";
import {
  applyCatalogTier,
  loadCatalogCoreSlugs,
  resolveSearchScope,
  SEARCH_RETURN_LIMIT,
  type CatalogTierFilter,
} from "../utils/catalog-core";

export async function listComponents(options: {
  category?: string;
  query?: string;
  registry?: string;
  tier?: CatalogTierFilter;
} = {}): Promise<void> {
  const originLabel = describeResolvedRegistry(options.registry);
  const core = loadCatalogCoreSlugs();
  const scope = resolveSearchScope({
    query: options.query,
    category: options.category,
    tier: options.tier,
  });

  console.log(`\n📚 Machine-First Design Agent Wiki: Component Catalog`);
  console.log(`🌐 Source: ${originLabel}`);
  console.log(`🔖 Trusted core: ${core.size} slugs in catalog-core.json\n`);

  const catalog = await fetchRegistryIndex(options.registry);

  if (catalog.length === 0) {
    console.log("⚠️ No components discovered. Ensure registry is compiled via 'pnpm build:registry' or local server is running.");
    return;
  }

  let filtered = catalog;
  if (options.category) {
    filtered = filtered.filter((i) => i.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options.query) {
    const q = options.query.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const ranked = applyCatalogTier(filtered, scope, core);
  const excludedByTier = filtered.length - ranked.length;
  const limit = options.query ? SEARCH_RETURN_LIMIT : undefined;
  const shown = limit ? ranked.slice(0, limit) : ranked;

  if (scope === "core") {
    console.log(`Showing trusted core (${ranked.length} of ${catalog.length} catalog items). Pass --all to include experimental.`);
  } else if (excludedByTier > 0) {
    console.log(`Showing ${shown.length} matches (${excludedByTier} excluded by --core).`);
  } else {
    console.log(`Showing ${shown.length} of ${ranked.length} matches (core first).`);
  }
  if (limit && ranked.length > limit) {
    console.log(`Truncated search to ${limit} rows. Narrow the query or use --core.\n`);
  } else {
    console.log("");
  }

  const grouped: Record<string, Array<RegistryItem & { tier: "core" | "experimental" }>> = {};
  shown.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  for (const [category, items] of Object.entries(grouped)) {
    console.log(`┌─ Category: [${category}] (${items.length} items)`);
    items.forEach((item) => {
      const mark = item.tier === "core" ? "core" : "experimental";
      console.log(`│  • ${item.name.padEnd(22)} - ${item.title}  [${mark}]`);
      console.log(`│    Tags: ${item.tags.join(", ") || "none"}`);
      console.log(`│    Dials: Var ${item.dials.design_variance}/10 · Mot ${item.dials.motion_intensity}/10 · Den ${item.dials.visual_density}/10`);
      console.log(`│    Install: npx design-wiki add ${item.name}`);
      console.log(`│`);
    });
    console.log(`└───────────────────────────────────────────────────────────\n`);
  }
}
