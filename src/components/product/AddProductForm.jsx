import {
  Autocomplete,
  AutocompleteItem,
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
import { useNavigate } from "react-router";
import { BRAND_KEY, CATEGORY_KEY, MATERIAL_KEY } from "../../constants/query-key";
import {
  ProductDimensionEnum,
  ProductDimensionUnitEnum,
  ProductWeightUnitEnum,
} from "../../enums/product.enum";
import { getAllBrands } from "../../service/brand.service";
import { getAllCategories } from "../../service/category.service";
import { addProduct, getProductMaterials } from "../../service/product.service";
import { addProductSchema } from "../../validations/product.schema";
import Editor from "../editor/Editor";

export const AddProductForm = () => {
  const navigate = useNavigate();
  const productDescriptionRef = useRef(null);
  const boxItemsRef = useRef(null);
  const highlightsRef = useRef(null);

  const { data: categoriesData, isFetching: isCategoriesFetching } = useQuery({
    queryKey: [CATEGORY_KEY],
    queryFn: getAllCategories,
  });

  const { data: brandsData, isFetching: isBrandsFetching } = useQuery({
    queryKey: [BRAND_KEY],
    queryFn: getAllBrands,
  });

  const { data: materialsData, isFetching: isMaterialsFetching } = useQuery({
    queryKey: [MATERIAL_KEY],
    queryFn: getProductMaterials,
  });

  const { mutateAsync } = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: "Product added successfully",
        color: "success",
      });
      navigate(`/product/${data.product.product_id}`);
    },
    onError: () => {
      addToast({
        title: "Error",
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
      name: "",
      warranty_info: "",
      return_and_refund_policy: "",
    },
  });

  const selectedDimensionTypes = useWatch({
    control,
    name: "dimension_types",
  });

  const onSubmit = async (data) => {
    const product = { product: { ...data } };
    await mutateAsync(product);
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
                render={({ field, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    selectedKey={field.value?.toString()}
                    onSelectionChange={(value) => field.onChange(Number(value))}
                    defaultItems={categoriesData?.categories || []}
                    isLoading={isCategoriesFetching}
                    label="Category"
                    placeholder="Select category"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    isRequired>
                    {(category) => (
                      <AutocompleteItem key={category.category_id}>
                        {category.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
              <Controller
                control={control}
                name="brand_id"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Autocomplete
                    selectedKey={field.value?.toString()}
                    onSelectionChange={(value) => field.onChange(Number(value))}
                    defaultItems={brandsData?.brands || []}
                    isLoading={isBrandsFetching}
                    label="Brand"
                    placeholder="Select brand"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    isRequired>
                    {(brand) => (
                      <AutocompleteItem key={brand.brand_id}>{brand.name}</AutocompleteItem>
                    )}
                  </Autocomplete>
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

          {/* Dimensions */}
          <div className="space-y-2">
            <h3 className="font-semibold">Dimensions</h3>

            {/* Dimension Type Selection */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Select dimension types to configure:</p>
              <Controller
                control={control}
                name="dimension_types"
                render={({ field }) => (
                  <CheckboxGroup
                    value={field.value || []}
                    onValueChange={(types) => {
                      field.onChange(types);
                      const newDimensions = types.map((type) => ({
                        type,
                      }));
                      setValue("dimensions", newDimensions);
                    }}
                    orientation="horizontal"
                    className="gap-4">
                    <Checkbox value={ProductDimensionEnum.box} color="primary">
                      Box
                    </Checkbox>
                    <Checkbox value={ProductDimensionEnum.product} color="primary">
                      Product
                    </Checkbox>
                  </CheckboxGroup>
                )}
              />
            </div>

            {/* Dynamic Dimension Forms */}
            <div className="space-y-3">
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
              <label className="mx-4 mt-2 block font-medium text-gray-700">In The Box</label>
              <Controller
                control={control}
                name="in_the_box"
                render={({ field }) => (
                  <Editor
                    ref={boxItemsRef}
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
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
