import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { addProductSchema } from "../../schemas/addProductSchema";
import {
  addProduct,
  getProductBrands,
  getProductCategories,
  getProductMaterials,
} from "../../service/product.service";
import Editor from "../editor/Editor";

export const AddProductForm = () => {
  const productDescriptionRef = useRef(null);
  const boxItemsRef = useRef(null);
  const highlightsRef = useRef(null);

  const { data: productCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getProductCategories,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getProductBrands,
  });

  const { data: materialsData } = useQuery({
    queryKey: ["materials"],
    queryFn: getProductMaterials,
  });

  const { mutate: addProductMutation } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      addToast({
        title: "Product added successfully",
        description: "Product added successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Failed to add product",
        description: "Failed to add product",
        color: "danger",
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
      number_of_pieces: 0,
      warranty_info: "",
      minimum_age_range: 0,
      maximum_age_range: 0,
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
      height: 0.01,
      width: 0.01,
      depth: 0.01,
      weight: 0.01,
      dimension_unit: "INCH",
      weight_unit: "KG",
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
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Height"
                  placeholder="0.00"
                  isInvalid={!!errors.dimensions?.[index]?.height}
                  errorMessage={errors.dimensions?.[index]?.height?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              control={control}
              name={`dimensions.${index}.width`}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Width"
                  placeholder="0.00"
                  isInvalid={!!errors.dimensions?.[index]?.width}
                  errorMessage={errors.dimensions?.[index]?.width?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              control={control}
              name={`dimensions.${index}.depth`}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Depth"
                  placeholder="0.00"
                  isInvalid={!!errors.dimensions?.[index]?.depth}
                  errorMessage={errors.dimensions?.[index]?.depth?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              control={control}
              name={`dimensions.${index}.weight`}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Weight"
                  placeholder="0.00"
                  isInvalid={!!errors.dimensions?.[index]?.weight}
                  errorMessage={errors.dimensions?.[index]?.weight?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name={`dimensions.${index}.dimension_unit`}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Dimension Unit"
                  placeholder="e.g., INCH, CM"
                  isInvalid={!!errors.dimensions?.[index]?.dimension_unit}
                  errorMessage={errors.dimensions?.[index]?.dimension_unit?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`dimensions.${index}.weight_unit`}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Weight Unit"
                  placeholder="e.g., KG, LB"
                  isInvalid={!!errors.dimensions?.[index]?.weight_unit}
                  errorMessage={errors.dimensions?.[index]?.weight_unit?.message}
                />
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
                  {...field}
                  label="Materials"
                  placeholder="Select materials"
                  isInvalid={!!errors.material_ids}
                  errorMessage={errors.material_ids?.message}
                  items={materialsData?.materials || []}
                  selectionMode="multiple"
                  onSelectionChange={(e) => field.onChange(e.target.value)}
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
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Number of Pieces"
                  placeholder="Enter number of pieces"
                  isInvalid={!!errors.number_of_pieces}
                  errorMessage={errors.number_of_pieces?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            {/* Age Range */}
            <div className="space-y-4">
              {/* <h3 className="text-lg font-semibold">Age Range</h3> */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="minimum_age_range"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label="Minimum Age"
                      placeholder="Enter minimum age"
                      isInvalid={!!errors.minimum_age_range}
                      errorMessage={errors.minimum_age_range?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                {/* Maximum Age */}
                <Controller
                  control={control}
                  name="maximum_age_range"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label="Maximum Age"
                      placeholder="Enter maximum age"
                      isInvalid={!!errors.maximum_age_range}
                      errorMessage={errors.maximum_age_range?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  label="Return Days"
                  placeholder="Enter Return and Refund Policy"
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
              <CardBody className="min-h-[200px]">
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
              <CardBody className="min-h-[200px]">
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
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isSubmitting}
              className="px-8">
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
