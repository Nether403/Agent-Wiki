import { describeResolvedRegistry, fetchRegistryIndex, RegistryItem } from "../utils/registry";

export async function listComponents(options: {
  category?: string;
  query?: string;
  registry?: string;
} = {}): Promise<void> {
  const originLabel = describeResolvedRegistry(options.registry);
  console.log(`\n📚 Machine-First Design Agent Wiki: Component Catalog`);
  console.log(`🌐 Source: ${originLabel}\n`);

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

  const grouped: Record<string, RegistryItem[]> = {};
  filtered.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  console.log(`Discovered ${filtered.length} verified zero-slop component(s):\n`);

  for (const [category, items] of Object.entries(grouped)) {
    console.log(`┌─ Category: [${category}] (${items.length} items)`);
    items.forEach((item) => {
      console.log(`│  • ${item.name.padEnd(22)} - ${item.title}`);
      console.log(`│    Tags: ${item.tags.join(", ") || "none"}`);
      console.log(`│    Dials: Var ${item.dials.design_variance}/10 · Mot ${item.dials.motion_intensity}/10 · Den ${item.dials.visual_density}/10`);
      console.log(`│    Install: npx design-wiki add ${item.name}`);
      console.log(`│`);
    });
    console.log(`└───────────────────────────────────────────────────────────\n`);
  }
}
