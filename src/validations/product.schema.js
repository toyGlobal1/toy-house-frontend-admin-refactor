import { z } from "zod";

export const productUpdateZodSchema = z.object({
  color_id: z.number(),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  base_price: z.number().min(0, "Base price must be a non-negative number"),
  selling_price: z.number().min(0, "Selling price must be a non-negative number"),
  applicable_tax_percent: z
    .number()
    .min(0, "Tax percent must be a non-negative number")
    .max(100, "Tax percent cannot exceed 100"),
  mark_unavailable: z.boolean(),
  is_featured: z.boolean(),
});
