import { z } from "zod";

export const inventoryUpdateZodSchema = z.object({
  color_id: z.number().int().min(1, "Color ID must be a positive integer"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  base_price: z.number().min(0, "Base price must be a non-negative number"),
  selling_price: z.number().min(0, "Selling price must be a non-negative number"),
  applicable_tax_percent: z
    .number()
    .min(0, "Tax percent must be a non-negative number")
    .max(100, "Tax percent cannot exceed 100"),
});

export const addInventoryZodSchema = z.object({
  color_id: z.number().int().min(1, "Color ID must be a positive integer"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  base_price: z.number().min(0, "Base price must be a non-negative number"),
  selling_price: z.number().min(0, "Selling price must be a non-negative number"),
  applicable_tax_percent: z
    .number()
    .min(0, "Tax percent must be a non-negative number")
    .max(100, "Tax percent cannot exceed 100"),
  is_featured: z.boolean().optional().default(false),
  mark_unavailable: z.boolean().optional().default(false),
});
