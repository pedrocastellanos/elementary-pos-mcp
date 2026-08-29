import { z } from "zod";
import { uuidSchema } from "./common.js";

export const createOrderSchema = z.object({
  itemId: uuidSchema,
  billId: uuidSchema.optional(),
  quantity: z.number(),
  modifiers: z.array(uuidSchema).optional(),
  note: z.string().optional(),
  customerId: uuidSchema.optional()
});

export const orderRequestSchema = z.object({
  itemId: uuidSchema,
  quantity: z.number(),
  modifiers: z.array(uuidSchema).optional(),
  note: z.string().optional()
});

export const createOrdersSchema = z.object({
  billId: uuidSchema.optional(),
  orders: z.array(orderRequestSchema),
  customerId: uuidSchema.optional()
});

export const orderIdSchema = z.object({
  orderId: uuidSchema
});
