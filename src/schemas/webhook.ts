import { z } from "zod";

export const registerWebhookSchema = z.object({
  callBackUrl: z.url()
});
