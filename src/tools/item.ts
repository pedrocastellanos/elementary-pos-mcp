import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { addItemSchema, editItemSchema, getItemsSchema, itemIdSchema } from "../schemas/item.js";
import { registerReadTool, registerWriteTool, success } from "./helpers.js";

export function registerItemTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_sales_items", "Get sales items, optionally filtered by category or color.", getItemsSchema,
    async (input, apiKey) => success(await api.post("/v1/item/get-sales-items", input, apiKey)));

  registerWriteTool(server, "elementary_add_sale_item", "Add a sales item.", addItemSchema,
    async (input, apiKey) => success(await api.post("/v1/item/add-sale-item", input, apiKey)));

  registerWriteTool(server, "elementary_edit_sale_item", "Edit a sales item.", editItemSchema,
    async (input, apiKey) => success(await api.post("/v1/item/edit-sale-item", input, apiKey)), { idempotent: true });

  registerWriteTool(server, "elementary_delete_sale_item", "Delete a sales item by UUID.", itemIdSchema,
    async (input, apiKey) => success(await api.post("/v1/item/delete-sale-item", input, apiKey)), { idempotent: true, destructive: true });
}
