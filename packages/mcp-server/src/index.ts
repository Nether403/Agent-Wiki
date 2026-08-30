#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createDesignWikiMcpServer } from "./server";

async function main() {
  const server = createDesignWikiMcpServer();
  const transport = new StdioServerTransport();

  console.error("🚀 Starting @design-wiki/mcp server over stdio...");
  await server.connect(transport);
  console.error("✅ Design Agent Wiki MCP Server connected and listening.");
}

main().catch((err) => {
  console.error("Fatal error starting MCP server:", err);
  process.exit(1);
});
