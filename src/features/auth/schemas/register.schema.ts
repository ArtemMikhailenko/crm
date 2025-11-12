import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .refine(val => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine(val => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine(val => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      }),
    passwordRepeat: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    recaptcha: z.string().min(1, { message: "reCAPTCHA verification required" }).optional(),
  })
  .superRefine(({ password, passwordRepeat }, ctx) => {
    if (password !== passwordRepeat) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordRepeat"],
        message: "Passwords do not match",
      });
    }
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
