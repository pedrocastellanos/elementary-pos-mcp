import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { createOrderSchema, createOrdersSchema, orderIdSchema } from "../schemas/order.js";
import { registerReadTool, registerWriteTool, success } from "./helpers.js";

export function registerOrderTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_order", "Get an order by UUID.", orderIdSchema,
    async (input, apiKey) => success(await api.post("/v1/order/get-order", input, apiKey)));

  registerWriteTool(server, "elementary_create_order", "Create an order. If billId is omitted, Elementary POS creates a new bill.", createOrderSchema,
    async (input, apiKey) => success(await api.post("/v1/order/create-order", input, apiKey)));

  registerWriteTool(server, "elementary_create_orders", "Create multiple orders in one request.", createOrdersSchema,
    async (input, apiKey) => success(await api.post("/v1/order/create-orders", input, apiKey)));
}
