import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SquarePenIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BRAND_KEY } from "../../constants/query-key";
import { updateBrand } from "../../service/brand.service";
import { uploadImageToIMG_BB } from "../../service/image.service";
import { brandZodSchema } from "../../validations/brand.schema";
import { FileUpload } from "../ui/FileUpload";

export function UpdateBrandModal({ brand }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Tooltip content="Edit" placement="top" radius="sm" color="foreground">
        <Button isIconOnly size="sm" color="warning" variant="flat" onPress={onOpen}>
          <SquarePenIcon className="size-3.5" />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col items-center gap-1">Update Brand</ModalHeader>
          <ModalBody className="pb-4">
            <UpdateBrandForm onClose={onClose} brand={brand} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function UpdateBrandForm({ onClose, brand }) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState({
    id: 1,
    url: brand?.brand_logo_url,
  });
  const isFileValid = (file && file?.file instanceof File) || !!file?.file?.url;

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(brandZodSchema),
    defaultValues: { name: brand.name, description: brand.description },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRAND_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Brand has been updated successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to update brand",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    let payload = {
      brandId: brand.brand_id,
      ...data,
      brandLogoUrl: brand.brand_logo_url,
    };
    if (file?.file instanceof File) {
      const formData = new FormData();
      formData.append("image", file.file);
      const res = await uploadImageToIMG_BB(formData);
      const imageUrl = res?.data.url;
      payload = { ...payload, brandLogoUrl: imageUrl };
    }
    await mutateAsync(payload);
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
        <FileUpload initialFile={file} onFileChange={setFile} />
      </div>

      <div className="!mt-6 flex justify-end gap-2">
        <Button
          type="submit"
          isLoading={isPending}
          isDisabled={!formState.isValid || isPending || !isFileValid}>
          Save
        </Button>
      </div>
    </form>
  );
}
