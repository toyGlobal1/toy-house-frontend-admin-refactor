import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { MATERIAL_KEY } from "../../constants/query-key";
import { addMaterial } from "../../service/material.service";
import { materialZodSchema } from "../../validations/material.schema";

export function AddMaterialModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button size="sm" onPress={onOpen}>
        <PlusCircleIcon className="size-4" />
        Add New Material
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">Add New Material</ModalHeader>
          <ModalBody className="pb-4">
            <AddMaterialForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AddMaterialForm({ onClose }) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(materialZodSchema),
    defaultValues: { name: "", description: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATERIAL_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Material has been added successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to add material",
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
        name="name"
        render={({ field, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            label="Material Name"
            placeholder="Enter material name"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState: { error, invalid } }) => (
          <Textarea
            {...field}
            label="Material Description"
            placeholder="Enter material description"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />

      <div className="!mt-6 flex justify-end gap-2">
        <Button type="submit" isLoading={isPending} isDisabled={!formState.isValid || isPending}>
          Create
        </Button>
      </div>
    </form>
  );
}
