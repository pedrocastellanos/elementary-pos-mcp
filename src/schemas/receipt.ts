import { z } from "zod";
import { uuidSchema } from "./common.js";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const isoDateTimeSchema = z.string().datetime({ offset: true }).or(z.string().datetime());

export const receiptIdSchema = z.object({
  receiptId: uuidSchema
});

export const receiptListSchema = z.object({
  from: dateSchema.optional(),
  lastModifiedFrom: isoDateTimeSchema.optional(),
  limit: z.number().int().min(1).max(500).default(100),
  page: z.number().int().min(0).default(0),
  to: dateSchema.optional()
});

export const receiptListGetSchema = z.object({
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
  limit: z.number().int().min(1).max(500).default(100),
  page: z.number().int().min(0).default(0)
});
