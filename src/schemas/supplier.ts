import { z } from "zod";
import { uuidSchema } from "./common.js";

export const createSupplierSchema = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional()
});

export const editSupplierSchema = z.object({
  supplierId: uuidSchema,
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional()
});

export const supplierIdSchema = z.object({
  supplierId: uuidSchema
});
