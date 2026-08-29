import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

const config = loadConfig();

console.error("Starting Elementary POS MCP server...");

await serveStdio(() => createServer(config));
