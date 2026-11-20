import assert from "node:assert/strict";
import { test } from "node:test";
import { onRequest } from "../functions/mcp.js";

async function sendMcpRequest(payload, origin) {
  const headers = {
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    host: "teste.pages.dev",
  };
  if (origin) headers.origin = origin;

  return onRequest({
    request: new Request("https://teste.pages.dev/mcp", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }),
    env: {},
    waitUntil() {},
  });
}

async function readJsonRpcResponse(response) {
  const body = await response.text();
  if (response.headers.get("content-type")?.includes("text/event-stream")) {
    const dataLine = body.split(/\r?\n/).find((line) => line.startsWith("data: "));
    assert.ok(dataLine);
    return JSON.parse(dataLine.slice(6));
  }
  return JSON.parse(body);
}

test("MCP exposes one tool that returns the construction message", async () => {
  const origin = "https://teste.pages.dev";
  const initializeResponse = await sendMcpRequest(
    {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    },
    origin,
  );
  assert.equal(initializeResponse.status, 200);
  assert.ok((await readJsonRpcResponse(initializeResponse)).result.protocolVersion);

  const toolsResponse = await sendMcpRequest(
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    origin,
  );
  assert.equal(toolsResponse.status, 200);
  const tools = (await readJsonRpcResponse(toolsResponse)).result.tools;
  assert.deepEqual(
    tools.map((tool) => tool.name),
    ["boas_vindas"],
  );

  const callResponse = await sendMcpRequest(
    {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "boas_vindas", arguments: {} },
    },
    origin,
  );
  assert.equal(callResponse.status, 200);
  assert.deepEqual((await readJsonRpcResponse(callResponse)).result.content, [
    { type: "text", text: "O projeto está em construção." },
  ]);
});

test("MCP also accepts clients without an Origin header", async () => {
  const response = await sendMcpRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: "boas_vindas", arguments: {} },
  });

  assert.equal(response.status, 200);
  assert.deepEqual((await readJsonRpcResponse(response)).result.content, [
    { type: "text", text: "O projeto está em construção." },
  ]);
});
