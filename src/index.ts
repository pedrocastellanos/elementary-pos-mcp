import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

const config = loadConfig();

if (config.transport === "http") {
  await import("./http.js");
} else if (config.transport === "both") {
  await import("./http.js");
  console.error("Starting Elementary POS MCP server (stdio + http)...");
  await serveStdio(() => createServer(config));
} else {
  console.error("Starting Elementary POS MCP server (stdio)...");
  await serveStdio(() => createServer(config));
}
