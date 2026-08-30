import http from "http";
import { createDesignWikiMcpServer } from "./server";

const PORT = Number(process.env.PORT) || 3001;

async function startHttpServer() {
  const server = createDesignWikiMcpServer();
  const registeredTools = (server as any)._registeredTools || {};

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    // Enable universal CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "online",
          service: "@design-wiki/mcp-http",
          version: "1.0.0",
          tools: Object.keys(registeredTools),
        })
      );
      return;
    }

    // SSE Stream endpoint
    if (url.pathname === "/sse") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write(`event: endpoint\ndata: ${JSON.stringify({ endpoint: "/mcp" })}\n\n`);
      return;
    }

    // JSON-RPC POST
    if (url.pathname === "/mcp" && req.method === "POST") {
      let bodyStr = "";
      req.on("data", (chunk) => {
        bodyStr += chunk;
      });

      req.on("end", async () => {
        try {
          const body = JSON.parse(bodyStr);

          if (body.method === "tools/list") {
            const toolList = Object.entries(registeredTools).map(
              ([name, tool]: [string, any]) => ({
                name,
                description: tool.description,
                inputSchema: tool.inputSchema,
              })
            );

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                jsonrpc: "2.0",
                id: body.id,
                result: { tools: toolList },
              })
            );
            return;
          }

          if (body.method === "tools/call") {
            const { name, arguments: args } = body.params || {};
            const tool = registeredTools[name];

            if (!tool) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  jsonrpc: "2.0",
                  id: body.id,
                  error: {
                    code: -32601,
                    message: `Method '${name}' not found.`,
                  },
                })
              );
              return;
            }

            const result = await tool.handler(args || {});
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                jsonrpc: "2.0",
                id: body.id,
                result,
              })
            );
            return;
          }

          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              jsonrpc: "2.0",
              id: body.id,
              error: { code: -32600, message: "Invalid Request" },
            })
          );
        } catch (err: any) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              jsonrpc: "2.0",
              error: { code: -32603, message: err.message },
            })
          );
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Design Agent Wiki MCP HTTP/SSE Server running on http://localhost:${PORT}`);
    console.log(`   - MCP Endpoint: http://localhost:${PORT}/mcp`);
    console.log(`   - SSE Stream:   http://localhost:${PORT}/sse`);
    console.log(`   - Health Check: http://localhost:${PORT}/health`);
  });
}

startHttpServer().catch((err) => {
  console.error("Fatal error starting HTTP MCP server:", err);
  process.exit(1);
});
