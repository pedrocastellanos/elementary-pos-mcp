import { z } from "zod";

const envSchema = z.object({
  ELEMENTARY_POS_API_KEY: z.string().min(1).optional(),
  ELEMENTARY_POS_BASE_URL: z.url().default("https://api.elementarypos.com"),
  ELEMENTARY_POS_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),
  MCP_TRANSPORT: z.enum(["stdio", "http", "both"]).default("http"),
  MCP_HTTP_PATH: z.string().default("/mcp")
});

export type Config = {
  apiKey?: string;
  baseUrl: string;
  timeoutMs: number;
  port: number;
  host: string;
  transport: "stdio" | "http" | "both";
  httpPath: string;
};

/**
 * Loads runtime configuration.
 *
 * The Elementary POS API key is NO LONGER read from the server's .env
 * at startup. It must be supplied by the MCP client on each tool call
 * via the `apiKey` parameter (configured in the client's mcp.json / settings).
 * The env var is kept only as an optional fallback for backwards compatibility.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse({
    ELEMENTARY_POS_API_KEY: env.ELEMENTARY_POS_API_KEY,
    ELEMENTARY_POS_BASE_URL: env.ELEMENTARY_POS_BASE_URL,
    ELEMENTARY_POS_TIMEOUT_MS: env.ELEMENTARY_POS_TIMEOUT_MS,
    PORT: env.PORT,
    HOST: env.HOST,
    MCP_TRANSPORT: env.MCP_TRANSPORT,
    MCP_HTTP_PATH: env.MCP_HTTP_PATH
  });

  return {
    ...(parsed.ELEMENTARY_POS_API_KEY !== undefined ? { apiKey: parsed.ELEMENTARY_POS_API_KEY } : {}),
    baseUrl: parsed.ELEMENTARY_POS_BASE_URL.replace(/\/+$/, ""),
    timeoutMs: parsed.ELEMENTARY_POS_TIMEOUT_MS,
    port: parsed.PORT,
    host: parsed.HOST,
    transport: parsed.MCP_TRANSPORT,
    httpPath: parsed.MCP_HTTP_PATH.startsWith("/") ? parsed.MCP_HTTP_PATH : `/${parsed.MCP_HTTP_PATH}`
  } as Config;
}
