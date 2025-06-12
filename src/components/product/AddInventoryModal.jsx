import {
  addToast,
  Button,
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
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { PRODUCT_COLOR_KEY, PRODUCT_INVENTORY_KEY } from "../../constants/query-key";
import { uploadImageToIMG_BB } from "../../service/image.service";
import { addProductInventory, getProductColors } from "../../service/product.service";
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
          <ModalBody className="min-h-[500px] pb-4">
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
  const { data } = useSuspenseQuery({ queryKey: [PRODUCT_COLOR_KEY], queryFn: getProductColors });
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
    },
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
      inventory: {
        ...data,
        product_images: await getUploadedImages(),
        product_videos: [], // TODO: Handle video uploads
      },
    };
    console.log("Form submitted with data:", data);
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
      <Tab key="videos" title="Videos">
        <div className="">Coming Soon...</div>
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
