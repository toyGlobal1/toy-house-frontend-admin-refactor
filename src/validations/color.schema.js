import { z } from "zod";

export const colorZodSchema = z.object({
  colorName: z
    .string()
    .min(1, "Color name is required")
    .max(50, "Color name cannot exceed 50 characters"),
  colorHexCode: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color code"),
});
