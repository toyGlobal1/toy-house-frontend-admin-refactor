import { z } from "zod";

export const addProductSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  brand_id: z.number().min(1, "Brand is required"),
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  number_of_pieces: z.number().min(1, "Number of pieces is required"),
  warranty_info: z.string().optional(),
  summary: z.string().optional(),
  minimum_age_range: z.number().min(0, "Minimum age is required"),
  maximum_age_range: z.number().min(0, "Maximum age is required"),
  material_ids: z.array(z.number()).min(1, "At least one material is required"),
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
  description: z.string().min(1, "Description is required"),
  return_and_refund_policy: z.string().optional(),
  in_the_box: z.string().optional(),
});
