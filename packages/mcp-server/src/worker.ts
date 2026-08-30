/**
 * Cloudflare Worker deployment entrypoint for @design-wiki/mcp
 * Serves MCP JSON-RPC protocol over HTTP and Server-Sent Events (SSE) for universal agent access.
 */

import { createDesignWikiMcpServer, stripPayloadToBudget } from "./server";

export interface Env {
  ENVIRONMENT?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id",
    };

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "online",
          service: "@design-wiki/mcp",
          version: "1.0.0",
          protocol: "2024-11-05",
          runtime: "cloudflare-workers",
          endpoints: {
            mcp: "/mcp",
            sse: "/sse",
            health: "/health",
          },
          tools: [
            "search_library",
            "fetch_raw_markup",
            "get_installation_schema",
            "search_components",
            "fetch_raw_markdown",
            "get_installation_commands",
            "audit_code_slop",
            "audit_and_fix_slop",
            "get_dependency_graph",
          ],
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // SSE Stream endpoint for streaming agent connections
    if (url.pathname === "/sse") {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      // Initial SSE handshake
      writer.write(
        encoder.encode(
          `event: endpoint\ndata: ${JSON.stringify({ endpoint: "/mcp" })}\n\n`
        )
      );

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...corsHeaders,
        },
      });
    }

    // MCP JSON-RPC Post Endpoint
    if (url.pathname === "/mcp" && request.method === "POST") {
      try {
        const body = (await request.json()) as any;
        const server = createDesignWikiMcpServer();
        const registeredTools = (server as any)._registeredTools || {};

        // Handle JSON-RPC method routing
        if (body.method === "tools/list") {
          const toolList = Object.entries(registeredTools).map(
            ([name, tool]: [string, any]) => ({
              name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })
          );

          return new Response(
            JSON.stringify({
              jsonrpc: "2.0",
              id: body.id,
              result: {
                tools: toolList,
              },
            }),
            {
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }

        if (body.method === "tools/call") {
          const { name, arguments: args } = body.params || {};
          const tool = registeredTools[name];

          if (!tool) {
            return new Response(
              JSON.stringify({
                jsonrpc: "2.0",
                id: body.id,
                error: {
                  code: -32601,
                  message: `Method '${name}' not found on Design Wiki MCP Server.`,
                },
              }),
              {
                status: 404,
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders,
                },
              }
            );
          }

          const result = await tool.handler(args || {});
          return new Response(
            JSON.stringify({
              jsonrpc: "2.0",
              id: body.id,
              result,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }

        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id: body.id,
            error: {
              code: -32600,
              message: "Invalid JSON-RPC request",
            },
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: `Internal MCP Worker Error: ${err.message}`,
            },
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
