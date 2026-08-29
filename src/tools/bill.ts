import type { McpServer } from "@modelcontextprotocol/server";
import type { ElementaryPosApiClient } from "../lib/api-client.js";
import { billIdSchema } from "../schemas/bill.js";
import { registerReadTool, success } from "./helpers.js";

export function registerBillTools(server: McpServer, api: ElementaryPosApiClient) {
  registerReadTool(
    server,
    "elementary_get_bill",
    "Get one bill by its UUID.",
    billIdSchema,
    async (input, apiKey) => success(await api.post("/v1/bill/get-bill", input, apiKey))
  );

  registerReadTool(
    server,
    "elementary_get_bills",
    "Get the bills available in Elementary POS.",
    undefined as never,
    async (_input, apiKey) => success(await api.post("/v1/bill/get-bills", undefined, apiKey))
  );
}
