import { z } from "zod";

export const settingsSchema = z.object({
  displayName: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;
