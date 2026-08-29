import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { createCustomerSchema, customerIdSchema, editCustomerSchema } from "../schemas/customer.js";
import { registerReadTool, registerWriteTool, success } from "./helpers.js";

export function registerCustomerTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_customer", "Get a customer by UUID.", customerIdSchema,
    async (input, apiKey) => success(await api.post("/v1/customer/get-customer", input, apiKey)));

  registerReadTool(server, "elementary_get_customers", "Get all customers.", undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/customer/get-customers", undefined, apiKey)));

  registerWriteTool(server, "elementary_create_customer", "Create a customer in Elementary POS.", createCustomerSchema,
    async (input, apiKey) => success(await api.post("/v1/customer/create-customer", input, apiKey)));

  registerWriteTool(server, "elementary_edit_customer", "Edit an existing customer.", editCustomerSchema,
    async (input, apiKey) => success(await api.post("/v1/customer/edit-customer", input, apiKey)), { idempotent: true });

  registerWriteTool(server, "elementary_delete_customer", "Delete a customer by UUID.", customerIdSchema,
    async (input, apiKey) => success(await api.post("/v1/customer/delete-customer", input, apiKey)), { idempotent: true, destructive: true });
}
