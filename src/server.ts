import { McpServer } from "@modelcontextprotocol/server";
import type { Config } from "./config.js";
import { ElementaryPosApiClient } from "./lib/api-client.js";
import { registerBillTools } from "./tools/bill.js";
import { registerCategoryTools } from "./tools/category.js";
import { registerCustomerTools } from "./tools/customer.js";
import { registerItemTools } from "./tools/item.js";
import { registerOrderTools } from "./tools/order.js";
import { registerReceiptTools } from "./tools/receipt.js";
import { registerStockTools } from "./tools/stock.js";
import { registerSupplierTools } from "./tools/supplier.js";
import { registerTaxTools } from "./tools/tax.js";
import { registerWebhookTools } from "./tools/webhook.js";

export function createServer(config: Config): McpServer {
  const server = new McpServer({
    name: "elementary-pos",
    version: "1.0.0",
    description: "MCP server for the Elementary POS Public API"
  });

  const api = new ElementaryPosApiClient(config);

  registerBillTools(server, api);
  registerCategoryTools(server, api);
  registerCustomerTools(server, api);
  registerItemTools(server, api);
  registerOrderTools(server, api);
  registerReceiptTools(server, api);
  registerStockTools(server, api);
  registerSupplierTools(server, api);
  registerTaxTools(server, api);
  registerWebhookTools(server, api);

  return server;
}
