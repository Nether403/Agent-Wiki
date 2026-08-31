import {
  applyCatalogTier,
  catalogTier,
  loadCatalogCoreSlugs,
  resolveSearchScope,
} from "../packages/cli/src/utils/catalog-core";
import { createDesignWikiMcpServer } from "../packages/mcp-server/src/server";
import fs from "fs";
import path from "path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`catalog-core test: ${message}`);
  }
}

interface McpToolResponse {
  content: Array<{ type: string; text: string }>;
}

async function main() {
  const core = loadCatalogCoreSlugs();
  assert(core.size >= 6, "catalog-core.json should list at least the compile seed");
  assert(core.has("button") && core.has("input") && core.has("card"), "seed primitives must be core");
  assert(!core.has("floating-dock"), "floating-dock stays experimental until promoted");
  assert(catalogTier("button", core) === "core", "button is core");
  assert(catalogTier("floating-dock", core) === "experimental", "floating-dock is experimental");

  const seed = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../catalog-seed.json"), "utf-8")
  ) as { slugs: string[] };
  const missing = seed.slugs.filter((slug) => !core.has(slug));
  assert(missing.length === 0, `seed must be a subset of core: ${missing.join(", ")}`);

  assert(resolveSearchScope({}) === "core", "unqualified search defaults to core");
  assert(resolveSearchScope({ query: "dock" }) === "all", "keyword search searches all");
  assert(resolveSearchScope({ category: "ui:motion" }) === "all", "category search searches all");
  assert(resolveSearchScope({ query: "dock", tier: "core" }) === "core", "explicit tier wins");

  const ranked = applyCatalogTier(
    [{ name: "floating-dock" }, { name: "button" }, { name: "input" }],
    "all",
    core
  );
  assert(ranked[0].name === "button" || ranked[0].name === "input", "core slugs sort first");
  assert(ranked[ranked.length - 1].name === "floating-dock", "experimental sorts last");

  const server = createDesignWikiMcpServer();
  const tools = (server as { _registeredTools: Record<string, { handler: (args: object) => Promise<McpToolResponse> }> })
    ._registeredTools;
  const search = tools["search_library"];

  const browse = JSON.parse((await search.handler({})).content[0].text);
  assert(browse.defaultedToCore === true, "MCP browse defaults to core");
  assert(
    browse.components.every((row: { tier: string }) => row.tier === "core"),
    "MCP browse is core-only"
  );
  assert(
    browse.components.some((row: { name: string }) => row.name === "button"),
    "MCP browse includes button"
  );

  const dock = JSON.parse(
    (await search.handler({ query: "dock", category: "ui:motion" })).content[0].text
  );
  assert(
    dock.components.some((row: { name: string }) => row.name === "floating-dock"),
    "keyword+category still finds experimental floating-dock"
  );

  const settings = JSON.parse(
    (await tools["compose_layout_tree"].handler({ pageType: "settings" })).content[0].text
  );
  assert(Array.isArray(settings.recommendedComponents), "settings compose returns recommendations");
  assert(
    settings.recommendedComponents.every((row: { tier: string }) => row.tier === "core"),
    "settings compose uses only core slugs"
  );

  console.log("catalog-core: OK");
  console.log(`  core slugs: ${core.size}`);
  console.log("  unqualified MCP search defaults to core");
  console.log("  keyword search still reaches experimental inventory");
  console.log("  compose_layout_tree(settings) is core-only");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
