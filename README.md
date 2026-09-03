# elementary-pos-mcp

Servidor MCP (Model Context Protocol) para la Public API de Elementary POS. Expone facturas, pedidos, recibos, stock, artículos, clientes, proveedores, impuestos, categorías y webhooks como herramientas MCP.

Stack: TypeScript ESM, `@modelcontextprotocol/server` v2, `zod` v4, `tsx`, Node 22.

## Arquitectura

```
src/
  index.ts        # Entry stdio (+ delega a http.ts según MCP_TRANSPORT)
  http.ts         # Transporte Streamable HTTP (stateless), /health, /, /mcp + CORS
  server.ts       # createServer(): registra los 10 módulos de tools
  config.ts       # Validación env con zod, resolución de API key
  lib/
    api-client.ts # Cliente fetch con X-Api-Key, timeout AbortController, errores tipados
    errors.ts     # ElementaryPosApiError / ElementaryPosConfigError
  schemas/        # Validación zod por dominio (bill, order, receipt, stock, item, customer, supplier, webhook, common)
  tools/          # Registro de tools (helpers.ts + 1 fichero por dominio)
examples/
  claude-code/.mcp.json
  cursor/mcp.json
Dockerfile          # Multi-stage Node 22 alpine, usuario no-root, CMD dist/http.js
```

Flujo: `MCP client -> createServer(config) -> register*Tools -> ElementaryPosApiClient -> https://api.elementarypos.com/v1/*` con cabecera `X-Api-Key`.

Autenticación por llamada (prioridad): `apiKey` param de la tool > header `x-api-key` / `Authorization: Bearer` (modo remoto) > env `X_API_KEY` / `ELEMENTARY_POS_API_KEY` (modo stdio local).

## Herramientas (32)

| Dominio | Tool | Tipo | Endpoint Elementary |
|---|---|---|---|
| Bills | `elementary_get_bill` | read | `POST /v1/bill/get-bill` |
| Bills | `elementary_get_bills` | read | `POST /v1/bill/get-bills` |
| Categories | `elementary_get_categories` | read | `POST /v1/category/get-categories` |
| Customers | `elementary_get_customer` | read | `POST /v1/customer/get-customer` |
| Customers | `elementary_get_customers` | read | `POST /v1/customer/get-customers` |
| Customers | `elementary_create_customer` | write | `POST /v1/customer/create-customer` |
| Customers | `elementary_edit_customer` | write/idempotente | `POST /v1/customer/edit-customer` |
| Customers | `elementary_delete_customer` | write/destructiva | `POST /v1/customer/delete-customer` |
| Items | `elementary_get_sales_items` | read | `POST /v1/item/get-sales-items` |
| Items | `elementary_add_sale_item` | write | `POST /v1/item/add-sale-item` |
| Items | `elementary_edit_sale_item` | write/idempotente | `POST /v1/item/edit-sale-item` |
| Items | `elementary_delete_sale_item` | write/destructiva | `POST /v1/item/delete-sale-item` |
| Orders | `elementary_get_order` | read | `POST /v1/order/get-order` |
| Orders | `elementary_create_order` | write | `POST /v1/order/create-order` |
| Orders | `elementary_create_orders` | write | `POST /v1/order/create-orders` |
| Receipts | `elementary_get_receipt` | read | `POST /v1/receipt/get-receipt` |
| Receipts | `elementary_get_receipts` | read | `POST /v1/receipt/get-receipts` |
| Receipts | `elementary_get_receipts_get` | read | `GET /v1/receipt/receipts` |
| Receipts | `elementary_get_receipt_pdf` | stub | Devuelve aviso: API binaria no expuesta en build JSON-only |
| Stock | `elementary_get_actual_stock` | read | `POST /v1/stock/get-actual-stock-data` |
| Stock | `elementary_get_stock_changes` | read | `POST /v1/stock/get-stock-changes` |
| Stock | `elementary_add_stock_change` | write/idempotente | `POST /v1/stock/add-stock-change` |
| Stock | `elementary_update_stock` | write/idempotente | `POST /v1/stock/update-stock` (máx 100 items) |
| Suppliers | `elementary_get_supplier` | read | `POST /v1/supplier/get-supplier` |
| Suppliers | `elementary_get_suppliers` | read | `POST /v1/supplier/get-suppliers` |
| Suppliers | `elementary_create_supplier` | write | `POST /v1/supplier/create-supplier` |
| Suppliers | `elementary_edit_supplier` | write/idempotente | `POST /v1/supplier/edit-supplier` |
| Suppliers | `elementary_delete_supplier` | write/destructiva | `POST /v1/supplier/delete-supplier` |
| Tax | `elementary_get_tax_settings` | read | `POST /v1/tax/get-tax-settings` |
| Webhook | `elementary_get_webhook_status` | read | `POST /v1/webhook/get-webhook-status` |
| Webhook | `elementary_enable_webhook` | write/idempotente | `POST /v1/webhook/enable-webhook` |
| Webhook | `elementary_disable_webhook` | write/destructiva | `POST /v1/webhook/disable-webhook` |

Notas: `elementary_create_order` crea bill nuevo si se omite `billId`. En stock, cantidad negativa = venta, positiva = entrada.

## Configuración

Variables (`src/config.ts`, ver `.env.example`):

| Var | Defecto | Descripción |
|---|---|---|
| `X_API_KEY` / `ELEMENTARY_POS_API_KEY` | — | Fallback local stdio. En remoto no usar .env, usar header |
| `ELEMENTARY_POS_BASE_URL` | `https://api.elementarypos.com` | Base API |
| `ELEMENTARY_POS_TIMEOUT_MS` | `15000` | Timeout fetch |
| `MCP_TRANSPORT` | `http` | `stdio` \| `http` \| `both` |
| `MCP_HTTP_PATH` | `/mcp` | Ruta MCP |
| `PORT` / `HOST` | `3001` / `0.0.0.0` | Servidor HTTP (Docker expone 3001) |

## Puesta en marcha

```bash
pnpm install
pnpm dev            # stdio según MCP_TRANSPORT (tsx src/index.ts)
pnpm dev:http       # HTTP directo (tsx src/http.ts)
pnpm typecheck && pnpm build
pnpm start          # node dist/index.js (stdio)
pnpm start:http     # node dist/http.js (HTTP)
```

Docker:

```bash
docker build -t elementary-pos-mcp .
docker run -p 3001:3001 elementary-pos-mcp
curl http://localhost:3001/health
```

Endpoints HTTP: `GET /` (info), `GET /health`, `POST /mcp` (protocolo MCP). CORS abierto con `x-api-key`, `mcp-session-id`.

## Integración clientes

Stdio local (Cursor `examples/cursor/mcp.json`, Claude Code `examples/claude-code/.mcp.json`): ajustar `/ABSOLUTE/PATH/.../dist/index.js` y `ELEMENTARY_POS_API_KEY`.

Remoto (opencode.json): pasar API key por headers, no por env:

```json
{
  "mcpServers": {
    "elementary-pos": {
      "type": "streamable-http",
      "url": "https://tu-host/mcp",
      "headers": { "x-api-key": "pak-..." }
    }
  }
}
```

## Errores

`ElementaryPosApiError` incluye status HTTP + payload. Timeout → `AbortError` con mensaje `timed out after {ms}ms`. Sin key → error que indica las 3 vías (param, header, env).
