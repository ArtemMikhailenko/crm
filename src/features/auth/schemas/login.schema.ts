import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  token: z.string().optional(),
  recaptcha: z.string().min(1, { message: "reCAPTCHA verification required" }).optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
