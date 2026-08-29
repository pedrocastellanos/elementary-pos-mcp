import { z } from "zod";
import { uuidSchema } from "./common.js";

export const getItemsSchema = z.object({
  filterCategoryId: uuidSchema.optional(),
  filterCategoryName: z.string().optional(),
  filterColor: z.number().int().min(1).max(8).optional()
});

export const addItemSchema = z.object({
  code: z.number().int(),
  itemName: z.string().min(1),
  taxId: uuidSchema,
  price: z.number().optional(),
  color: z.number().int().min(1).max(8),
  sku: z.string().optional(),
  categoryId: uuidSchema.optional(),
  note: z.string().optional(),
  onSale: z.boolean().optional()
});

export const editItemSchema = z.object({
  code: z.number().int(),
  itemId: uuidSchema,
  itemName: z.string().min(1),
  taxId: uuidSchema,
  price: z.number().optional(),
  color: z.number().int().min(1).max(8),
  sku: z.string().optional(),
  categoryId: uuidSchema.optional(),
  onSale: z.boolean().optional()
});

export const itemIdSchema = z.object({
  itemId: uuidSchema
});
