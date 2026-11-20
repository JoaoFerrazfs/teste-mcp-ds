import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";

function createServer() {
  const server = new McpServer({
    name: "boas-vindas",
    version: "1.0.0",
  });

  server.registerTool(
    "boas_vindas",
    { description: "Informa que o projeto está em construção." },
    async () => ({
      content: [{ type: "text", text: "O projeto está em construção." }],
    }),
  );

  return server;
}

const handleMcpRequest = createMcpHandler(createServer);

export function onRequest(context) {
  const { request } = context;
  const requestUrl = new URL(request.url);

  if (request.headers.get("Origin") === requestUrl.origin) {
    const handleSameOriginRequest = createMcpHandler(createServer, {
      allowedHostnames: [requestUrl.hostname],
      corsOptions: { origin: requestUrl.origin },
    });

    return handleSameOriginRequest(request, context.env, context);
  }

  return handleMcpRequest(request, context.env, context);
}
