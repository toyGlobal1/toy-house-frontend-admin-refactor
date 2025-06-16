import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BRAND_KEY, CATEGORY_KEY, MATERIAL_KEY } from "../../constants/query-key";
import { ProductDimensionUnitEnum, ProductWeightUnitEnum } from "../../enums/product.enum";
import {
  addProduct,
  getProductBrands,
  getProductCategories,
  getProductMaterials,
} from "../../service/product.service";
import { addProductSchema } from "../../validations/product.schema";
import Editor from "../editor/Editor";

export const AddProductForm = () => {
  const productDescriptionRef = useRef(null);
  const boxItemsRef = useRef(null);
  const highlightsRef = useRef(null);

  const { data: productCategories } = useQuery({
    queryKey: [CATEGORY_KEY],
    queryFn: getProductCategories,
  });

  const { data: brandsData } = useQuery({
    queryKey: [BRAND_KEY],
    queryFn: getProductBrands,
  });

  const { data: materialsData } = useQuery({
    queryKey: [MATERIAL_KEY],
    queryFn: getProductMaterials,
  });

  const { mutate: addProductMutation } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      addToast({
        title: "Product added successfully",
        description: "Product added successfully",
        color: "success",
        placement: "top-right",
      });
    },
    onError: () => {
      addToast({
        title: "Failed to add product",
        description: "Failed to add product",
        color: "danger",
        placement: "top-right",
      });
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      category_id: 1,
      brand_id: 1,
      name: "",
      warranty_info: "",
      material_ids: [],
      dimensions: [],
      description: "",
      return_and_refund_policy: "",
      dimension_types: [],
      summary: "",
      in_the_box: "",
    },
  });

  const selectedDimensionTypes = useWatch({
    control,
    name: "dimension_types",
  });

  const handleDimensionTypeChange = (types) => {
    // Update the dimension_types field
    setValue("dimension_types", types);

    // Create dimension objects based on selected types
    const newDimensions = types.map((type) => ({
      type,
    }));

    setValue("dimensions", newDimensions);
  };

  const onSubmit = (data) => {
    const product = { product: { ...data } };
    addProductMutation(product);
  };

  const renderDimensionForm = (type, index) => (
    <Card key={type} className="border-2 border-default-200 p-4">
      <CardHeader className="pb-2">
        <h4 className="text-md font-semibold capitalize">{type} Dimensions</h4>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Controller
              control={control}
              name={`dimensions.${index}.height`}
              render={({ field, fieldState: { error, invalid } }) => (
                <NumberInput
                  value={field.value}
                  onValueChange={field.onChange}
                  label="Height"
                  placeholder="0.00"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name={`dimensions.${index}.width`}
              render={({ field, fieldState: { error, invalid } }) => (
                <NumberInput
                  value={field.value}
                  onValueChange={field.onChange}
                  label="Width"
                  placeholder="0.00"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name={`dimensions.${index}.depth`}
              render={({ field, fieldState: { error, invalid } }) => (
                <NumberInput
                  value={field.value}
                  onValueChange={field.onChange}
                  label="Depth"
                  placeholder="0.00"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name={`dimensions.${index}.weight`}
              render={({ field, fieldState: { error, invalid } }) => (
                <NumberInput
                  value={field.value}
                  onValueChange={field.onChange}
                  label="Weight"
                  placeholder="0.00"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name={`dimensions.${index}.dimension_unit`}
              render={({ field, fieldState: { error, invalid } }) => (
                <Select
                  {...field}
                  label="Dimension Unit"
                  placeholder="Select dimension unit"
                  isInvalid={invalid}
                  errorMessage={error?.message}>
                  {Object.values(ProductDimensionUnitEnum)?.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              control={control}
              name={`dimensions.${index}.weight_unit`}
              render={({ field, fieldState: { error, invalid } }) => (
                <Select
                  {...field}
                  label="Weight Unit"
                  placeholder="Select weight unit"
                  isInvalid={invalid}
                  errorMessage={error?.message}>
                  {Object.values(ProductWeightUnitEnum)?.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create New Product</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Category and Brand */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Category"
                    placeholder={
                      !productCategories
                        ? "Loading categories..."
                        : productCategories.categories.length === 0
                          ? "No categories"
                          : "Select category"
                    }
                    isInvalid={!!errors.category_id}
                    errorMessage={errors.category_id?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    items={productCategories?.categories || []}
                    isRequired
                    disabled={!productCategories}>
                    {(category) => (
                      <SelectItem key={category.category_id}>{category.name}</SelectItem>
                    )}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Brand"
                    placeholder={
                      !brandsData
                        ? "Loading brands..."
                        : brandsData.brands.length === 0
                          ? "No brands"
                          : "Select brand"
                    }
                    isInvalid={!!errors.brand_id}
                    errorMessage={errors.brand_id?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    items={brandsData?.brands || []}
                    isRequired
                    disabled={!brandsData}>
                    {(brand) => <SelectItem key={brand.brand_id}>{brand.name}</SelectItem>}
                  </Select>
                )}
              />
            </div>

            {/* Product Name */}
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Product Name"
                  placeholder="Enter product name"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  isRequired
                />
              )}
            />

            {/* Product Description */}
            <div className="rounded-lg border-2 border-default-200 bg-default-50">
              <CardHeader className="mb-[-15px]">
                <span className="text-sm text-default-600">Product Description</span>
                <span className="text-xs text-danger">*</span>
              </CardHeader>
              <CardBody className="p-0">
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Editor
                      {...field}
                      className="h-full w-full border-none shadow-none"
                      ref={productDescriptionRef}
                      defaultValue={field.value}
                      onTextChange={() => {
                        const html = productDescriptionRef.current?.root?.innerHTML;
                        field.onChange(html);
                      }}
                    />
                  )}
                />
              </CardBody>
            </div>
          </div>

          <Divider />

          {/* Materials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Materials</h3>
            <Controller
              control={control}
              name="material_ids"
              render={({ field }) => (
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
                  label="Materials"
                  placeholder="Select materials"
                  isInvalid={!!errors.material_ids}
                  errorMessage={errors.material_ids?.message}
                  items={materialsData?.materials || []}
                  selectionMode="multiple"
                  disabled={!materialsData}>
                  {(material) => (
                    <SelectItem key={material.material_id}>{material.name}</SelectItem>
                  )}
                </Select>
              )}
            />
          </div>

          <Divider />

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dimensions</h3>

            {/* Dimension Type Selection */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Select dimension types to configure:</p>
              <Controller
                control={control}
                name="dimension_types"
                render={({ field }) => (
                  <CheckboxGroup
                    value={field.value || []}
                    onValueChange={handleDimensionTypeChange}
                    orientation="horizontal"
                    className="gap-4">
                    <Checkbox value="BOX" color="primary">
                      Box
                    </Checkbox>
                    <Checkbox value="PRODUCT" color="primary">
                      Product
                    </Checkbox>
                  </CheckboxGroup>
                )}
              />
            </div>

            {/* Dynamic Dimension Forms */}
            <div className="space-y-4">
              {selectedDimensionTypes?.map((type, index) => renderDimensionForm(type, index))}

              {(!selectedDimensionTypes || selectedDimensionTypes.length === 0) && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center text-gray-500">
                  <p>Select dimension types above to configure dimensions</p>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            {/* Number of Pieces */}
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

            {/* Age Range */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                {/* Maximum Age */}
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

            {/* Warranty Information */}
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

            {/* Return and Refund Policy */}
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
            <h3 className="text-lg font-semibold">Detailed Information</h3>

            <div className="rounded-lg border-2 border-default-200 bg-default-50">
              <CardHeader className="mb-[-15px]">
                <span className="text-md font-semibold">Box Items</span>
              </CardHeader>
              <CardBody className="p-0">
                <Controller
                  control={control}
                  name="in_the_box"
                  render={({ field }) => (
                    <Editor
                      {...field}
                      className="h-full w-full border-none shadow-none"
                      ref={boxItemsRef}
                      defaultValue={field.value}
                      onTextChange={() => {
                        const html = boxItemsRef.current?.root?.innerHTML;
                        field.onChange(html);
                      }}
                    />
                  )}
                />
              </CardBody>
            </div>

            <div className="rounded-lg border-2 border-default-200 bg-default-50">
              <CardHeader className="mb-[-15px]">
                <span className="text-md font-semibold">Highlights</span>
              </CardHeader>
              <CardBody className="p-0">
                <Controller
                  control={control}
                  name="summary"
                  render={({ field }) => (
                    <Editor
                      {...field}
                      className="h-full w-full border-none shadow-none"
                      ref={highlightsRef}
                      defaultValue={field.value}
                      onTextChange={() => {
                        const html = highlightsRef.current?.root?.innerHTML;
                        field.onChange(html);
                      }}
                    />
                  )}
                />
              </CardBody>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" color="primary" isLoading={isSubmitting} className="px-8">
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
