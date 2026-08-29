import { z } from "zod";
import { uuidSchema } from "./common.js";

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional(),
  loyaltyId: z.string().optional()
});

export const editCustomerSchema = z.object({
  customerId: uuidSchema,
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional(),
  loyaltyId: z.string().optional()
});

export const customerIdSchema = z.object({
  customerId: uuidSchema
});
