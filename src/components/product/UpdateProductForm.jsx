import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { BRAND_KEY, CATEGORY_KEY, MATERIAL_KEY, PRODUCT_KEY } from "../../constants/query-key";
import {
  getProductBrands,
  getProductCategories,
  getProductMaterials,
  updateProduct,
} from "../../service/product.service";
import { addProductSchema } from "../../validations/product.schema";
import Editor from "../editor/Editor";

export const UpdateProductForm = ({ product }) => {
  const productDescriptionRef = useRef(null);
  const boxItemsRef = useRef(null);
  const highlightsRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: categoriesData, isFetching: isCategoriesFetching } = useQuery({
    queryKey: [CATEGORY_KEY],
    queryFn: getProductCategories,
  });

  const { data: brandsData, isFetching: isBrandsFetching } = useQuery({
    queryKey: [BRAND_KEY],
    queryFn: getProductBrands,
  });

  const { data: materialsData, isFetching: isMaterialsFetching } = useQuery({
    queryKey: [MATERIAL_KEY],
    queryFn: getProductMaterials,
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries([PRODUCT_KEY, product.product_id]);
      addToast({
        title: "Success",
        description: "Product updated successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to update product",
        color: "danger",
      });
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addProductSchema),
    values: {
      category_id: product.category.category_id,
      brand_id: product.brand.brand_id,
      name: product.product_name,
      number_of_pieces: product.number_of_pieces,
      warranty_info: product.warranty_info,
      minimum_age_range: product.minimum_age_range,
      maximum_age_range: product.maximum_age_range,
      material_ids: product.materials.map((material) => material.material_id.toString()),
      description: product.description,
      return_and_refund_policy: product.return_and_refund_policy,
      summary: product.summary, // NOTE: Summary is Highlights in UI
      in_the_box: product.in_the_box,
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      product_id: product.product_id,
      product: { ...data, dimensions: product.dimensions, sku: product.sku },
    };
    await mutateAsync(payload);
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <h2 className="text-xl font-medium">Update Product Information</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Category and Brand */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="category_id"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Select
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    defaultSelectedKeys={[field.value.toString()]}
                    items={categoriesData?.categories || []}
                    isLoading={isCategoriesFetching}
                    label="Category"
                    placeholder="Select category"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    isRequired>
                    {(category) => (
                      <SelectItem key={category.category_id}>{category.name}</SelectItem>
                    )}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="brand_id"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Select
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    defaultSelectedKeys={[field.value.toString()]}
                    items={brandsData?.brands || []}
                    isLoading={isBrandsFetching}
                    label="Brand"
                    placeholder="Select brand"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    isRequired>
                    {(brand) => <SelectItem key={brand.brand_id}>{brand.name}</SelectItem>}
                  </Select>
                )}
              />
            </div>
            {/* Product Name */}
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  label="Product Name"
                  placeholder="Enter product name"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  isRequired
                />
              )}
            />
            {/* Product Description */}
            <div className="rounded-lg border-2 border-default-200 bg-default-50">
              <label className="mx-4 mt-2 block font-medium text-gray-700">
                Product Description
              </label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Editor
                    className="h-full w-full border-none shadow-none"
                    ref={productDescriptionRef}
                    defaultValue={product?.product_description}
                    onTextChange={() => {
                      const html = productDescriptionRef.current?.root?.innerHTML;
                      field.onChange(html);
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* Materials */}
          <div className="space-y-2">
            <h3 className="font-semibold">Materials</h3>
            <Controller
              control={control}
              name="material_ids"
              render={({ field, fieldState: { error, invalid } }) => (
                <Select
                  value={field.value}
                  onChange={(e) => {
                    if (!e.target.value) {
                      field.onChange(undefined);
                      return;
                    }
                    const selectedValues = e.target.value.split(",");
                    const numericValues = selectedValues.map((val) => Number(val));
                    numericValues.sort();
                    field.onChange(numericValues);
                  }}
                  defaultSelectedKeys={field.value}
                  items={materialsData?.materials || []}
                  isLoading={isMaterialsFetching}
                  label="Materials"
                  placeholder="Select materials"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  selectionMode="multiple">
                  {(material) => (
                    <SelectItem key={material.material_id}>{material.name}</SelectItem>
                  )}
                </Select>
              )}
            />
          </div>

          <Divider />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Controller
                  control={control}
                  name="number_of_pieces"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <NumberInput
                      value={field.value}
                      onValueChange={field.onChange}
                      label="Number of Pieces"
                      placeholder="Enter number of pieces"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="minimum_age_range"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <NumberInput
                      value={field.value}
                      onValueChange={field.onChange}
                      label="Minimum Age Range"
                      placeholder="Enter minimum age"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="maximum_age_range"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <NumberInput
                      value={field.value}
                      onValueChange={field.onChange}
                      label="Maximum Age Range"
                      placeholder="Enter maximum age"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />
              </div>
            </div>
            <Controller
              control={control}
              name="warranty_info"
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Warranty Information"
                  placeholder="Enter warranty information"
                  isInvalid={!!errors.warranty_info}
                  errorMessage={errors.warranty_info?.message}
                  minRows={3}
                />
              )}
            />
            <Controller
              control={control}
              name="return_and_refund_policy"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Return and Refund Policy"
                  placeholder="Enter the return and refund policy"
                  isInvalid={!!errors.return_and_refund_policy}
                  errorMessage={errors.return_and_refund_policy?.message}
                />
              )}
            />
          </div>
          <Divider />
          {/* Detailed Information */}
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-default-200 bg-default-50">
              <label className="mx-4 mt-2 block font-medium text-gray-700">In the box</label>
              <Controller
                control={control}
                name="in_the_box"
                render={({ field }) => (
                  <Editor
                    ref={boxItemsRef}
                    defaultValue={product?.in_the_box}
                    onTextChange={() => {
                      const html = boxItemsRef.current?.root?.innerHTML;
                      field.onChange(html);
                    }}
                  />
                )}
              />
            </div>

            <div className="rounded-lg border-2 border-default-200 bg-default-50">
              <label className="mx-4 mt-2 block font-medium text-gray-700">Highlights</label>
              <Controller
                control={control}
                name="summary"
                render={({ field }) => (
                  <Editor
                    ref={highlightsRef}
                    defaultValue={product?.summary}
                    onTextChange={() => {
                      const html = highlightsRef.current?.root?.innerHTML;
                      field.onChange(html);
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              className="px-8 font-medium uppercase">
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
