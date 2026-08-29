import type { McpServer } from "@modelcontextprotocol/server";
import type { ZodType } from "zod";
import { z } from "zod";

export type ToolResult = {
  content: [{ type: "text"; text: string }];
  structuredContent?: unknown;
  isError?: boolean;
};

const apiKeyField = z
  .string()
  .min(1)
  .optional()
  .describe(
    "Elementary POS API Key. Configure it in the MCP client (e.g., Claude Desktop mcp.json `env` or MCP settings), NOT in the server .env. If omitted, the server will fall back to ELEMENTARY_POS_API_KEY env var if set."
  );

function withApiKey(schema: ZodType | undefined): ZodType {
  if (!schema) {
    return z.object({ apiKey: apiKeyField });
  }
  if (schema instanceof z.ZodObject) {
    return (schema as z.ZodObject<any>).extend({ apiKey: apiKeyField });
  }
  try {
    return z.object({ apiKey: apiKeyField }).merge(schema as z.ZodObject<any>);
  } catch {
    return z.object({ apiKey: apiKeyField });
  }
}

export function success<T>(data: T): ToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data
  };
}

export function failure(error: unknown): ToolResult {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  return {
    content: [{ type: "text", text: message }],
    isError: true
  };
}

export function registerReadTool(
  server: McpServer,
  name: string,
  description: string,
  inputSchema: ZodType,
  handler: (input: any, apiKey?: string) => Promise<ToolResult>
) {
  const schemaWithKey = withApiKey(inputSchema);
  server.registerTool(
    name,
    {
      description: `${description} Requires \`apiKey\` if the server was not started with ELEMENTARY_POS_API_KEY env.`,
      inputSchema: schemaWithKey,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (input: any) => {
      const { apiKey, ...rest } = input ?? {};
      try {
        return await handler(rest, apiKey);
      } catch (error) {
        return failure(error);
      }
    }
  );
}

export function registerWriteTool(
  server: McpServer,
  name: string,
  description: string,
  inputSchema: ZodType,
  handler: (input: any, apiKey?: string) => Promise<ToolResult>,
  options: { idempotent?: boolean; destructive?: boolean } = {}
) {
  const schemaWithKey = withApiKey(inputSchema);
  server.registerTool(
    name,
    {
      description: `${description} Requires \`apiKey\` if the server was not started with ELEMENTARY_POS_API_KEY env.`,
      inputSchema: schemaWithKey,
      annotations: {
        readOnlyHint: false,
        destructiveHint: options.destructive ?? false,
        idempotentHint: options.idempotent ?? false,
        openWorldHint: true
      }
    },
    async (input: any) => {
      const { apiKey, ...rest } = input ?? {};
      try {
        return await handler(rest, apiKey);
      } catch (error) {
        return failure(error);
      }
    }
  );
}
