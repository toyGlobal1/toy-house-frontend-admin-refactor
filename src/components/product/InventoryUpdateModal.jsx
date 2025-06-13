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
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { SquarePenIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { COLOR_KEY, PRODUCT_INVENTORY_KEY } from "../../constants/query-key";
import { getAllColors } from "../../service/color.service";
import { updateProductInventory } from "../../service/product.service";
import { inventoryUpdateZodSchema } from "../../validations/product.schema";

export function InventoryUpdateModal({ inventory }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
          <ModalBody className="pb-4">
            <InventoryUpdateForm inventory={inventory} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function InventoryUpdateForm({ inventory, onClose }) {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: [COLOR_KEY], queryFn: getAllColors });
  const colors = data?.colors;

  const selectedColor = colors.find(
    (i) => i.color_name.toLowerCase() === inventory.color.toLowerCase()
  );

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(inventoryUpdateZodSchema),
    values: {
      color_id: selectedColor?.color_id || "",
      quantity: inventory.quantity || 0,
      base_price: inventory.base_price || 0,
      selling_price: inventory.selling_price || 0,
      applicable_tax_percent: inventory.applicable_tax_percent,
      mark_unavailable: inventory.mark_unavailable || false,
      is_featured: inventory.is_featured || false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateProductInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Product inventory has been updated successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to update product inventory",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      product_inventory_id: inventory.inventory_id,
      inventory: {
        ...data,
        is_featured: inventory.is_featured,
        mark_unavailable: inventory.mark_unavailable,
      },
    };
    console.log("Form submitted with data:", payload);
    await mutateAsync(payload);
  };

  return (
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
            defaultSelectedKeys={[field.value.toString()]}
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
        <Button variant="light" onPress={onClose} color="danger">
          Cancel
        </Button>
        <Button
          type="submit"
          color="success"
          isLoading={isPending}
          isDisabled={!formState.isValid || !formState.isDirty || isPending}>
          Save
        </Button>
      </div>
    </form>
  );
}
