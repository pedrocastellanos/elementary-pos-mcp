import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { addStockChangeSchema, stockChangesSchema, updateStockSchema } from "../schemas/stock.js";
import { registerReadTool, registerWriteTool, success } from "./helpers.js";

export function registerStockTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_actual_stock", "Get current stock data.", undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/stock/get-actual-stock-data", undefined, apiKey)));

  registerReadTool(server, "elementary_get_stock_changes", "Get stock changes after a UNIX synchronization timestamp.", stockChangesSchema,
    async (input, apiKey) => success(await api.post("/v1/stock/get-stock-changes", input, apiKey)));

  registerWriteTool(server, "elementary_add_stock_change", "Apply a stock change. Negative quantity means sell; positive means stock-up.", addStockChangeSchema,
    async (input, apiKey) => success(await api.post("/v1/stock/add-stock-change", input, apiKey)), { idempotent: true });

  registerWriteTool(server, "elementary_update_stock", "Set absolute stock quantities. Maximum 100 items per request.", updateStockSchema,
    async (input, apiKey) => success(await api.post("/v1/stock/update-stock", input, apiKey)), { idempotent: true });
}
