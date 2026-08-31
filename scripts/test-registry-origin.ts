import fs from "fs";
import http from "http";
import os from "os";
import path from "path";
import {
  DEFAULT_REGISTRY_HTTP,
  formatRegistryOrigin,
  resolveRegistryOrigin,
  type RegistryOrigin,
} from "../packages/cli/src/utils/registry-origin";
import { fetchComponentItem, fetchRegistryIndex } from "../packages/cli/src/utils/registry";
import { resolveInstallBaseUrl } from "../packages/mcp-server/src/registry-origin";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`registry-origin test: ${message}`);
  }
}

function isHttp(origin: RegistryOrigin, baseUrl: string): void {
  assert(origin.kind === "http", `expected http origin, got ${formatRegistryOrigin(origin)}`);
  assert(origin.kind === "http" && origin.baseUrl === baseUrl, `expected ${baseUrl}`);
}

function isFile(origin: RegistryOrigin, rootDir: string): void {
  assert(origin.kind === "file", `expected file origin, got ${formatRegistryOrigin(origin)}`);
  assert(origin.kind === "file" && origin.rootDir === rootDir, `expected ${rootDir}`);
}

const fixtureItem = {
  name: "button",
  type: "registry:ui",
  title: "FROM_ORIGIN",
  description: "Fixture item used to prove local catalog is skipped.",
  category: "ui:primitive",
  tags: ["test"],
  dials: { design_variance: 1, motion_intensity: 1, visual_density: 1 },
  a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
  dependencies: [],
  registryDependencies: [],
  files: [],
};

async function withTempRegistry<T>(run: (rootDir: string) => Promise<T> | T): Promise<T> {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "design-wiki-registry-"));
  fs.mkdirSync(path.join(rootDir, "r"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "r", "button.json"),
    JSON.stringify(fixtureItem),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(rootDir, "r", "registry.json"),
    JSON.stringify([fixtureItem]),
    "utf-8"
  );
  try {
    return await run(rootDir);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
}

async function listen(
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void
): Promise<{ url: string; close: () => Promise<void> }> {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert(address && typeof address === "object", "server address missing");
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

async function main() {
  isHttp(
    resolveRegistryOrigin({
      explicit: "https://registry.example/wiki/",
      env: {},
      localRoots: ["/tmp/does-not-exist"],
    }),
    "https://registry.example/wiki"
  );

  isHttp(
    resolveRegistryOrigin({
      env: { DESIGN_WIKI_REGISTRY_URL: "https://cdn.example" },
      localRoots: ["/tmp/does-not-exist"],
    }),
    "https://cdn.example"
  );

  isHttp(
    resolveRegistryOrigin({
      env: {},
      localRoots: ["/tmp/does-not-exist-either"],
    }),
    DEFAULT_REGISTRY_HTTP
  );

  await withTempRegistry(async (rootDir) => {
    isFile(
      resolveRegistryOrigin({ explicit: rootDir, env: {} }),
      rootDir
    );
    isFile(
      resolveRegistryOrigin({ env: {}, localRoots: [rootDir] }),
      rootDir
    );

    const fromFile = await fetchComponentItem("button", rootDir);
    assert(fromFile?.title === "FROM_ORIGIN", "file origin should read the temp catalog");

    const missing = await fetchComponentItem("floating-dock", rootDir);
    assert(missing === null, "file origin must not fall back to the monorepo catalog");
  });

  const previousEnv = process.env.DESIGN_WIKI_REGISTRY_URL;
  delete process.env.DESIGN_WIKI_REGISTRY_URL;
  assert(
    resolveInstallBaseUrl() === DEFAULT_REGISTRY_HTTP,
    "MCP install URL defaults to localhost"
  );
  assert(
    resolveInstallBaseUrl("https://hosted.example/") === "https://hosted.example",
    "MCP tool baseUrl wins"
  );
  process.env.DESIGN_WIKI_REGISTRY_URL = "https://env.example/";
  assert(
    resolveInstallBaseUrl() === "https://env.example",
    "MCP install URL reads DESIGN_WIKI_REGISTRY_URL when baseUrl is omitted"
  );
  if (previousEnv === undefined) {
    delete process.env.DESIGN_WIKI_REGISTRY_URL;
  } else {
    process.env.DESIGN_WIKI_REGISTRY_URL = previousEnv;
  }

  const workspacePublic = path.resolve(__dirname, "../apps/docs/public");
  if (fs.existsSync(path.join(workspacePublic, "r", "registry.json"))) {
    const workspaceOrigin = resolveRegistryOrigin({
      env: {},
      cwd: path.resolve(__dirname, ".."),
    });
    isFile(workspaceOrigin, workspacePublic);
  }

  const httpServer = await listen((req, res) => {
    const url = req.url ?? "";
    res.setHeader("content-type", "application/json");
    if (url === "/r/button.json" || url === "/r/registry.json") {
      res.end(url === "/r/registry.json" ? JSON.stringify([fixtureItem]) : JSON.stringify(fixtureItem));
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  });

  try {
    const fromHttp = await fetchComponentItem("button", httpServer.url);
    assert(fromHttp?.title === "FROM_ORIGIN", "http origin must skip the local compiled catalog");
    const index = await fetchRegistryIndex(httpServer.url);
    assert(index.length === 1 && index[0].title === "FROM_ORIGIN", "http index must not merge local items");
    const localOnly = await fetchComponentItem("floating-dock", httpServer.url);
    assert(localOnly === null, "http origin 404 must not fall back to local floating-dock");
  } finally {
    await httpServer.close();
  }

  console.log("registry-origin: OK");
  console.log("  explicit https skips local files");
  console.log("  DESIGN_WIKI_REGISTRY_URL is honored");
  console.log("  file:// / directory origins read root/r/*.json only");
  console.log("  MCP install baseUrl uses env when the tool omits baseUrl");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
