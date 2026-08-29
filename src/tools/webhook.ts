import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { registerWebhookSchema } from "../schemas/webhook.js";
import { registerReadTool, registerWriteTool, success } from "./helpers.js";

export function registerWebhookTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_webhook_status", "Get the current Elementary POS webhook status.", undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/webhook/get-webhook-status", undefined, apiKey)));

  registerWriteTool(server, "elementary_enable_webhook", "Enable the Elementary POS webhook using the supplied callback URL.", registerWebhookSchema,
    async (input, apiKey) => success(await api.post("/v1/webhook/enable-webhook", input, apiKey)), { idempotent: true });

  registerWriteTool(server, "elementary_disable_webhook", "Disable the Elementary POS webhook.", undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/webhook/disable-webhook", undefined, apiKey)), { idempotent: true, destructive: true });
}
