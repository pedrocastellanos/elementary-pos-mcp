import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { receiptIdSchema, receiptListGetSchema, receiptListSchema } from "../schemas/receipt.js";
import { registerReadTool, success } from "./helpers.js";

export function registerReceiptTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(server, "elementary_get_receipt", "Get a receipt by UUID.", receiptIdSchema,
    async (input, apiKey) => success(await api.post("/v1/receipt/get-receipt", input, apiKey)));

  registerReadTool(server, "elementary_get_receipts", "Get a paginated list of receipts.", receiptListSchema,
    async (input, apiKey) => success(await api.post("/v1/receipt/get-receipts", input, apiKey)));

  registerReadTool(server, "elementary_get_receipts_get", "Get a paginated list of receipts using the documented GET endpoint.", receiptListGetSchema,
    async (input, apiKey) => success(await api.get("/v1/receipt/receipts", input, apiKey)));

  registerReadTool(server, "elementary_get_receipt_pdf", "Get a receipt PDF. The API returns a PDF binary response; this tool is not enabled because the current MCP implementation is JSON-only.", receiptIdSchema,
    async () => ({
      content: [{
        type: "text",
        text: "Receipt PDF endpoint exists in the Elementary POS API, but this JSON-only MCP build does not expose binary PDF content."
      }]
    })
  );
}
