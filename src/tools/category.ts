import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { registerReadTool, success } from "./helpers.js";

export function registerCategoryTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(
    server,
    "elementary_get_categories",
    "Get all categories from Elementary POS.",
    undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/category/get-categories", undefined, apiKey))
  );
}
