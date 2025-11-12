import { z } from "zod";

export const recoverySchema = z.object({
  email: z.string().email("Invalid email address"),
  recaptcha: z.string().min(1, { message: "reCAPTCHA verification required" }).optional(),
});

export type RecoverySchemaType = z.infer<typeof recoverySchema>;
