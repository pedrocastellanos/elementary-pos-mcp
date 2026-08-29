import { z } from "zod";
import { uuidSchema } from "./common.js";

export const billIdSchema = z.object({
  billId: uuidSchema
});
