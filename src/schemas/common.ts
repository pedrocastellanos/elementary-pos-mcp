import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const unitSchema = z.enum([
  "pc", "mg", "g", "dag", "kg", "oz", "lb",
  "ml", "cl", "l", "gal", "pt", "mm", "m"
]);

export const billTypeSchema = z.enum(["permanent", "temporary"]);
export const orderStateSchema = z.enum(["created", "finished", "deleted"]);
export const taxTypeSchema = z.enum([
  "ADDED_TO_PRICE",
  "INCLUDED_IN_PRICE",
  "NO_TAX",
  "CONSTANT",
  "MULTIPLE"
]);

export function optionalNullable<T extends z.ZodType>(schema: T) {
  return schema.optional().nullable();
}
