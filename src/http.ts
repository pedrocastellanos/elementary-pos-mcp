import http from "node:http";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

const config = loadConfig();

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body));
}

async function toWebRequest(req: http.IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? `${config.host}:${config.port}`;
  const proto = (req.headers["x-forwarded-proto"] as string) ?? "http";
  const url = `${proto}://${host}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue;
    headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  }
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "DELETE") {
    body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", (c) => (data += c));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });
    if (body === "") body = undefined;
  }
  return new Request(url, { method: req.method ?? "POST", headers, ...(body !== undefined ? { body } : {}) } as RequestInit);
}

async function writeWebResponse(webRes: Response, nodeRes: http.ServerResponse) {
  nodeRes.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));
  if (webRes.body) {
    const reader = webRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      nodeRes.write(value);
    }
    nodeRes.end();
  } else {
    const text = await webRes.text();
    nodeRes.end(text);
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id, mcp-protocol-version, Authorization, X-Api-Key, ELEMENTARY_POS_API_KEY, X-Elementary-Pos-Api-Key");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://${config.host}:${config.port}`);

  if (url.pathname === "/health") {
    sendJson(res, 200, { status: "ok", transport: "streamable-http", path: config.httpPath });
    return;
  }

  if (url.pathname === "/" && req.method === "GET") {
    sendJson(res, 200, { name: "elementary-pos-mcp", version: "1.0.0", mcp: config.httpPath, health: "/health" });
    return;
  }

  if (url.pathname !== config.httpPath) {
    sendJson(res, 404, { error: `Not found. MCP endpoint is ${config.httpPath}` });
    return;
  }

  try {
    const getHeader = (name: string) => {
      const v = req.headers[name.toLowerCase()];
      return Array.isArray(v) ? v[0] : v;
    };
    const rawHeader =
      getHeader("ELEMENTARY_POS_API_KEY") ??
      getHeader("X-API-KEY") ??
      getHeader("X-ELEMENTARY-POS-API-KEY") ??
      getHeader("ELEMENTARY-POS-API-KEY") ??
      undefined;
    const auth = getHeader("authorization");
    const headerKey = (rawHeader as string | undefined) ?? (auth ? String(auth).replace(/^Bearer\s+/i, "") : undefined);
    if (!headerKey) {
      console.error(`[mcp] ${req.method} ${url.pathname} no apiKey header. Got headers:`, Object.keys(req.headers).join(", "));
    } else {
      console.error(`[mcp] ${req.method} ${url.pathname} apiKey from header (${headerKey.slice(0, 8)}...)`);
    }
    const requestConfig = headerKey?.trim() ? { ...config, apiKey: headerKey.trim() } : config;
    const webReq = await toWebRequest(req);
    const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const mcpServer = createServer(requestConfig);
    await mcpServer.connect(transport);
    const webRes = await transport.handleRequest(webReq);
    await writeWebResponse(webRes, res);
  } catch (e) {
    console.error("MCP handleRequest error:", e);
    if (!res.headersSent) sendJson(res, 500, { error: e instanceof Error ? e.message : String(e) });
  }
});

server.listen(config.port, config.host, () => {
  console.error(`Elementary POS MCP (streamable-http) listening on http://${config.host}:${config.port}${config.httpPath}`);
  console.error(`Health: http://${config.host}:${config.port}/health`);
});
