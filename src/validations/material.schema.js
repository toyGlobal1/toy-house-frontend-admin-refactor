import { z } from "zod";

export const materialZodSchema = z.object({
  name: z
    .string()
    .min(1, "Material name is required")
    .max(100, "Material name cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Material description is required")
    .max(500, "Material description cannot exceed 500 characters"),
});
