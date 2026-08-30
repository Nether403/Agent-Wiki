import worker from "../src/worker";

async function testWorkerMcpServer() {
  console.log("\n⚡ =======================================================");
  console.log("⚡ CLOUDFLARE WORKER MCP SERVER: DEPLOYMENT TEST SUITE");
  console.log("⚡ Testing Edge JSON-RPC & Server-Sent Events (SSE)");
  console.log("⚡ =======================================================\n");

  // Test 1: Health probe
  console.log("Test 1: Testing /health endpoint...");
  const healthReq = new Request("http://localhost:8787/health", { method: "GET" });
  const healthRes = await worker.fetch(healthReq, {}, {});
  const healthBody = (await healthRes.json()) as any;

  console.log("   - Status:", healthBody.status);
  console.log("   - Runtime:", healthBody.runtime);
  console.log("   - Registered Tools:", healthBody.tools.length);

  if (healthRes.status !== 200 || healthBody.status !== "online" || healthBody.runtime !== "cloudflare-workers") {
    throw new Error("❌ Worker health probe failed.");
  }
  console.log("✅ Test 1 Passed: Edge Worker health check succeeded.");

  // Test 2: SSE handshake
  console.log("\nTest 2: Testing /sse endpoint handshake...");
  const sseReq = new Request("http://localhost:8787/sse", { method: "GET" });
  const sseRes = await worker.fetch(sseReq, {}, {});

  console.log("   - Status:", sseRes.status);
  console.log("   - Content-Type:", sseRes.headers.get("Content-Type"));

  if (sseRes.status !== 200 || sseRes.headers.get("Content-Type") !== "text/event-stream") {
    throw new Error("❌ Worker SSE handshake failed.");
  }
  console.log("✅ Test 2 Passed: SSE stream initialized.");

  // Test 3: tools/list via JSON-RPC POST
  console.log("\nTest 3: Testing MCP tools/list over JSON-RPC POST...");
  const listReq = new Request("http://localhost:8787/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {},
    }),
  });

  const listRes = await worker.fetch(listReq, {}, {});
  const listBody = (await listRes.json()) as any;

  console.log("   - Response ID:", listBody.id);
  console.log("   - Tools returned:", listBody.result?.tools?.length);
  const toolNames = listBody.result?.tools?.map((t: any) => t.name) || [];
  console.log("   - Tool names:", toolNames.join(", "));

  if (!toolNames.includes("search_library") || !toolNames.includes("get_dependency_graph") || !toolNames.includes("fetch_raw_markup")) {
    throw new Error("❌ Worker tools/list did not return required MCP tools.");
  }
  console.log("✅ Test 3 Passed: tools/list returned all registered tools.");

  // Test 4: tools/call search_library
  console.log("\nTest 4: Testing MCP tools/call (search_library)...");
  const searchCallReq = new Request("http://localhost:8787/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "search_library",
        arguments: { query: "button" },
      },
    }),
  });

  const searchCallRes = await worker.fetch(searchCallReq, {}, {});
  const searchCallBody = (await searchCallRes.json()) as any;
  const searchContent = JSON.parse(searchCallBody.result?.content?.[0]?.text);

  console.log("   - Search match count:", searchContent.matchCount);
  console.log("   - Found component:", searchContent.components?.[0]?.name);

  if (!searchContent.components || searchContent.components.length === 0) {
    throw new Error("❌ Worker search_library execution returned empty results.");
  }
  console.log("✅ Test 4 Passed: Worker tools/call executed search_library.");

  // Test 5: tools/call get_dependency_graph
  console.log("\nTest 5: Testing MCP tools/call (get_dependency_graph)...");
  const graphCallReq = new Request("http://localhost:8787/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "get_dependency_graph",
        arguments: { name: "pricing-table" },
      },
    }),
  });

  const graphCallRes = await worker.fetch(graphCallReq, {}, {});
  const graphCallBody = (await graphCallRes.json()) as any;
  const graphContent = JSON.parse(graphCallBody.result?.content?.[0]?.text);

  console.log("   - Component:", graphContent.component);
  console.log("   - Topological Sequence:", graphContent.topologicalInstallSequence);
  console.log("   - Peer Dependencies:", graphContent.npmDependencies);

  if (graphContent.component !== "pricing-table" || !graphContent.topologicalInstallSequence) {
    throw new Error("❌ Worker get_dependency_graph execution failed.");
  }
  console.log("✅ Test 5 Passed: Worker dynamic dependency graph tool verified.");

  console.log("\n🎉 ALL CLOUDFLARE WORKER DEPLOYMENT TESTS PASSED (100% Maturity)!\n");
}

testWorkerMcpServer().catch((err) => {
  console.error("❌ Worker test failed:", err);
  process.exit(1);
});
