import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { registerReadTool, success } from "./helpers.js";

export function registerTaxTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_tax_settings", "Get tax settings.", undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/tax/get-tax-settings", undefined, apiKey)));
}
