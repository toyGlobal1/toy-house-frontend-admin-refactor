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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BRAND_KEY } from "../../constants/query-key";
import { addBrand } from "../../service/brand.service";
import { uploadImageToIMG_BB } from "../../service/image.service";
import { brandZodSchema } from "../../validations/brand.schema";
import { FileUpload } from "../ui/FileUpload";

export function AddBrandModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button size="sm" onPress={onOpen}>
        <PlusCircleIcon className="size-4" />
        Add New Brand
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">Add New Brand</ModalHeader>
          <ModalBody className="pb-4">
            <AddBrandForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AddBrandForm({ onClose }) {
  const [file, setFile] = useState(null);
  const isFileValid = file && file?.file instanceof File;
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(brandZodSchema),
    defaultValues: { name: "", description: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRAND_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Brand has been added successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to add brand",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    if (file?.file instanceof File) {
      const formData = new FormData();
      formData.append("image", file.file);
      const res = await uploadImageToIMG_BB(formData);
      const imageUrl = res?.data.url;
      const payload = { ...data, brandLogoUrl: imageUrl };
      console.log("Form submitted with data:", payload);
      await mutateAsync(payload);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            label="Brand Name"
            placeholder="Enter brand name"
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
            label="Brand Description"
            placeholder="Enter brand description"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <div className="rounded-xl border-2 p-1">
        <label className="mb-1 ml-2 inline-block text-xs">Brand Logo</label>
        <FileUpload onFileChange={setFile} />
      </div>

      <div className="!mt-6 flex justify-end gap-2">
        <Button
          type="submit"
          isLoading={isPending}
          isDisabled={!formState.isValid || isPending || !isFileValid}>
          Create
        </Button>
      </div>
    </form>
  );
}
