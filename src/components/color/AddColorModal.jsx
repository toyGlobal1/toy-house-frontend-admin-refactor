import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Controller, useForm } from "react-hook-form";
import { COLOR_KEY } from "../../constants/query-key";
import { addColor } from "../../service/color.service";
import { colorZodSchema } from "../../validations/color.schema";

export function AddColorModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button size="sm" onPress={onOpen}>
        <PlusCircleIcon className="size-4" />
        Add New Color
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">Add New Color</ModalHeader>
          <ModalBody className="pb-4">
            <AddColorForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AddColorForm({ onClose }) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(colorZodSchema),
    defaultValues: { colorName: "", colorHexCode: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLOR_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Color has been added successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to add color",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    await mutateAsync(data);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="colorName"
        render={({ field, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            label="Color Name"
            placeholder="Enter color name"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <div className="rounded-xl border-2 p-1">
        <label htmlFor="colorHexCode" className="mb-1 ml-2 inline-block text-xs">
          Color Hex Code
        </label>
        <Controller
          control={control}
          name="colorHexCode"
          render={({ field }) => (
            <>
              <HexColorInput
                id="colorHexCode"
                className="mb-3 inline-block w-full rounded-lg border-2 border-default p-2 text-sm"
                placeholder="Enter the hex code without (#)"
                color={field.value}
                onChange={field.onChange}
              />
              <HexColorPicker color={field.value} onChange={field.onChange} />
            </>
          )}
        />
      </div>
      <div className="!mt-6 flex justify-end gap-2">
        <Button type="submit" isLoading={isPending} isDisabled={!formState.isValid || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
}
