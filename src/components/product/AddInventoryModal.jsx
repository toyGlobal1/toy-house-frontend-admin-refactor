import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { PlusCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { COLOR_KEY, PRODUCT_INVENTORY_KEY } from "../../constants/query-key";
import { getAllColors } from "../../service/color.service";
import { uploadImageToIMG_BB } from "../../service/image.service";
import { addProductInventory } from "../../service/product.service";
import { addInventoryZodSchema } from "../../validations/product.schema";
import { InventoryFileUploadGallery } from "../ui/InventoryFileUploadGallery";

export function AddInventoryModal() {
  const { id: productId } = useParams();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button size="sm" onPress={onOpen}>
        <PlusCircleIcon className="size-4" />
        Add New Inventory
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex justify-center">Add New Inventory</ModalHeader>
          <ModalBody className="max-h-[500px] min-h-[500px] pb-4">
            <AddInventoryForm productId={productId} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AddInventoryForm({ productId, onClose }) {
  const [selectedKey, setSelectedKey] = useState("images");
  const [files, setFiles] = useState([]);

  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: [COLOR_KEY], queryFn: getAllColors });
  const colors = data?.colors;

  const getUploadedImages = async () => {
    const images = [];
    for (const file of files) {
      if (file.file instanceof File) {
        const formData = new FormData();
        formData.append("image", file.file);
        const data = await uploadImageToIMG_BB(formData);
        const image_url = data?.data.url;
        images.push({ image_url, is_display_image: file.isDisplayImage });
      }
    }
    return images;
  };

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(addInventoryZodSchema),
    defaultValues: {
      mark_unavailable: false,
      is_featured: false,
      product_videos: [{ video_url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "product_videos",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addProductInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_KEY, productId] });
      onClose();
      addToast({
        title: "Success",
        description: "New product inventory has been added successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to add new product inventory",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      product_id: productId,
      inventory: { ...data, product_images: await getUploadedImages() },
    };
    await mutateAsync(payload);
  };

  return (
    <Tabs
      destroyInactiveTabPanel={false}
      selectedKey={selectedKey}
      onSelectionChange={setSelectedKey}>
      <Tab key="images" title="Images">
        <div className="">
          <InventoryFileUploadGallery initialFiles={[]} onFileChange={setFiles} />
        </div>
        <Button className="absolute bottom-8 right-8" onPress={() => setSelectedKey("videos")}>
          Next
        </Button>
      </Tab>
      <Tab key="videos" title="Videos" className="overflow-y-auto">
        <label htmlFor="product_videos" className="inline-block text-sm">
          Video URLs{" "}
          <span className="text-xs font-medium text-gray-500">(YouTube embed links only)</span>
        </label>
        {fields.map((field, index) => (
          <div className="my-1" key={field.id}>
            <div className="flex items-center gap-2">
              <Controller
                name={`product_videos.${index}.video_url`}
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    id="product_videos"
                    {...field}
                    size="sm"
                    label={`URL #${index + 1}`}
                    placeholder="https://youtube.com"
                    variant="bordered"
                    className="flex-1"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
              {fields.length > 1 && (
                <Button
                  isIconOnly
                  type="button"
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => remove(index)}
                  aria-label="Remove URL"
                  className="self mb-2">
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          onPress={() => append({ video_url: "" })}
          className="mt-1 w-fit">
          <PlusIcon className="size-4" />
          Add More URL
        </Button>

        <Button className="absolute bottom-8 right-8" onPress={() => setSelectedKey("basic-info")}>
          Next
        </Button>
      </Tab>
      <Tab key="basic-info" title="Basic Info">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="color_id"
            render={({ field, fieldState: { error, invalid } }) => (
              <Select
                value={field.value}
                onChange={(e) => {
                  const fieldValue = e.target.value;
                  field.onChange(Number(fieldValue));
                }}
                label="Color"
                placeholder="Select the color"
                variant="bordered"
                isInvalid={invalid}
                errorMessage={error?.message}>
                {colors?.map((item) => (
                  <SelectItem key={item.color_id} value={item.color_id}>
                    {item.color_name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            control={control}
            name="quantity"
            render={({ field, fieldState: { error, invalid } }) => (
              <NumberInput
                value={field.value}
                onValueChange={field.onChange}
                label="Quantity"
                placeholder="Enter quantity"
                variant="bordered"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="base_price"
            render={({ field, fieldState: { error, invalid } }) => (
              <NumberInput
                value={field.value}
                onValueChange={field.onChange}
                label="Base Price"
                placeholder="Enter base price"
                variant="bordered"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="selling_price"
            render={({ field, fieldState: { error, invalid } }) => (
              <NumberInput
                value={field.value}
                onValueChange={field.onChange}
                label="Selling Price"
                placeholder="Enter selling price"
                variant="bordered"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="applicable_tax_percent"
            render={({ field, fieldState: { error, invalid } }) => (
              <NumberInput
                value={field.value}
                onValueChange={field.onChange}
                label="Applicable Tax Percent"
                placeholder="Enter applicable tax percent"
                variant="bordered"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />

          <div className="!mt-6 flex justify-end gap-2">
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="secondary"
              isLoading={isPending}
              isDisabled={!formState.isValid || isPending}>
              Create
            </Button>
          </div>
        </form>
      </Tab>
    </Tabs>
  );
}
