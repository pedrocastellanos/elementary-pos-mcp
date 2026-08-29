import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { createSupplierSchema, editSupplierSchema, supplierIdSchema } from "../schemas/supplier.js";
import { registerReadTool, registerWriteTool, success } from "./helpers.js";

export function registerSupplierTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_supplier", "Get a supplier by UUID.", supplierIdSchema,
    async (input, apiKey) => success(await api.post("/v1/supplier/get-supplier", input, apiKey)));

  registerReadTool(server, "elementary_get_suppliers", "Get all suppliers.", undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/supplier/get-suppliers", undefined, apiKey)));

  registerWriteTool(server, "elementary_create_supplier", "Create a supplier.", createSupplierSchema,
    async (input, apiKey) => success(await api.post("/v1/supplier/create-supplier", input, apiKey)));

  registerWriteTool(server, "elementary_edit_supplier", "Edit a supplier.", editSupplierSchema,
    async (input, apiKey) => success(await api.post("/v1/supplier/edit-supplier", input, apiKey)), { idempotent: true });

  registerWriteTool(server, "elementary_delete_supplier", "Delete a supplier by UUID.", supplierIdSchema,
    async (input, apiKey) => success(await api.post("/v1/supplier/delete-supplier", input, apiKey)), { idempotent: true, destructive: true });
}
