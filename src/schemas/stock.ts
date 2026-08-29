import { z } from "zod";
import { unitSchema } from "./common.js";

export const addStockChangeSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number(),
  unit: unitSchema.optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  requestId: z.string().min(1),
  pluginId: z.string().min(1),
  note: z.string().optional()
});

export const stockChangesSchema = z.object({
  lastSyncTimestamp: z.number().int().nonnegative().optional(),
  skipPluginId: z.string().optional()
});

export const updateStockItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number(),
  unit: unitSchema.optional(),
  price: z.number().optional(),
  currency: z.string().optional()
});

export const updateStockSchema = z.object({
  items: z.array(updateStockItemSchema).min(1).max(100),
  pluginId: z.string().min(1),
  note: z.string().optional()
});
