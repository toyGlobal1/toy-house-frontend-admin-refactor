import { z } from "zod";

export const addProductSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  brand_id: z.number().min(1, "Brand is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  number_of_pieces: z.number().optional(),
  warranty_info: z.string().optional(),
  minimum_age_range: z.number().optional(),
  maximum_age_range: z.number().optional(),
  material_ids: z.array(z.number()).optional(),
  dimensions: z
    .array(
      z.object({
        type: z.enum(["BOX", "PRODUCT"]),
        height: z.number().min(0.01, "Height is required"),
        width: z.number().min(0.01, "Width is required"),
        depth: z.number().min(0.01, "Depth is required"),
        weight: z.number().min(0.01, "Weight is required"),
        dimension_unit: z.string().min(1, "Dimension unit is required"),
        weight_unit: z.string().min(1, "Weight unit is required"),
      })
    )
    .min(1, "At least one dimension is required"),
  return_and_refund_policy: z.string().optional(),
  in_the_box: z.string().optional(),
  summary: z.string().optional(),
});

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
  product_videos: z.array(z.object({ video_url: z.string().url().min(1) })).optional(),
  is_featured: z.boolean().optional().default(false),
  mark_unavailable: z.boolean().optional().default(false),
});
