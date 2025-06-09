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
  Switch,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { SquarePenIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { PRODUCT_COLOR_KEY, PRODUCT_KEY } from "../../constants/query-key";
import { deleteProduct, getProductColors } from "../../service/product.service";
import { productUpdateZodSchema } from "../../validations/product.schema";

export function InventoryUpdateModal({ inventory }) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Product has been deleted successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to delete product",
        color: "danger",
      });
    },
  });

  return (
    <>
      <Button isIconOnly size="sm" color="warning" onPress={onOpen}>
        <SquarePenIcon className="size-4" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">
            Edit Product Inventory
          </ModalHeader>
          <ModalBody>
            <InventoryUpdateForm inventory={inventory} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function InventoryUpdateForm({ inventory, onClose }) {
  const { data } = useSuspenseQuery({ queryKey: [PRODUCT_COLOR_KEY], queryFn: getProductColors });
  const colors = data.colors || [];

  // const selectedColor = colors.find((color) => color.color_name === inventory.color);

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(productUpdateZodSchema),
    values: {
      // colorId: selectedColor.color_id || "",
      quantity: inventory.quantity || 0,
      base_price: inventory.base_price || 0,
      selling_price: inventory.selling_price || 0,
      applicable_tax_percent: inventory.applicable_tax_percent,
      mark_unavailable: inventory.mark_unavailable || false,
      is_featured: inventory.is_featured || false,
    },
  });

  console.log(inventory);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="color_id"
        render={({ field, fieldState: { error, invalid } }) => (
          <Select
            {...field}
            label="Sport"
            placeholder="Select the color"
            labelPlacement="outside"
            defaultSelectedKeys={[field.value]}
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}>
            {colors?.map((item) => (
              <SelectItem key={item.color_id}>{item.color_name}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        control={control}
        name="quantity"
        render={({ field, fieldState: { error, invalid } }) => (
          <NumberInput
            {...field}
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
            {...field}
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
            {...field}
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
            {...field}
            label="Applicable Tax Percent"
            placeholder="Enter applicable tax percent"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="mark_unavailable"
        render={({ field }) => (
          <Switch
            size="sm"
            isSelected={field.value}
            onValueChange={field.onChange}
            classNames={{
              base: "flex flex-row-reverse justify-between max-w-full",
              label: "ms-0",
            }}>
            Mark Unavailable
          </Switch>
        )}
      />
      <Controller
        control={control}
        name="is_featured"
        render={({ field }) => (
          <Switch
            size="sm"
            isSelected={field.value}
            onValueChange={field.onChange}
            classNames={{
              base: "flex flex-row-reverse justify-between max-w-full",
              label: "ms-0",
            }}>
            Featured Product
          </Switch>
        )}
      />
      <div className="!mt-6 flex justify-end gap-2">
        <Button variant="light" onPress={onClose} color="danger">
          Cancel
        </Button>
        <Button
          type="submit"
          color="success"
          // isLoading={isPending}
          // isDisabled={!formState.isValid || !formState.isDirty || isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
