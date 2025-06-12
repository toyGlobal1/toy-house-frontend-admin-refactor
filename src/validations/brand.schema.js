import { z } from "zod";

export const brandZodSchema = z.object({
  name: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name cannot exceed 100 characters"),
  description: z.string().max(500, "Brand description cannot exceed 500 characters").optional(),
});
