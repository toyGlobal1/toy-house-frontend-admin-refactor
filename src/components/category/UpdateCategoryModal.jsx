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
import { CATEGORY_KEY } from "../../constants/query-key";
import { updateCategory } from "../../service/category.service";
import { uploadImageToIMG_BB } from "../../service/image.service";
import { categoryZodSchema } from "../../validations/category.schema";
import { FileUpload } from "../ui/FileUpload";

export function UpdateCategoryModal({ category }) {
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
          <ModalHeader className="flex flex-col items-center gap-1">Update Category</ModalHeader>
          <ModalBody className="pb-4">
            <UpdateCategoryForm onClose={onClose} category={category} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function UpdateCategoryForm({ onClose, category }) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState({
    id: 1,
    url: category?.category_logo_url,
  });
  const isFileValid = (file && file?.file instanceof File) || !!file?.file?.url;

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(categoryZodSchema),
    values: { name: category.name, description: category.description },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      onClose();
      addToast({
        title: "Success",
        description: "Category has been updated successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to update category",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    let payload = {
      categoryId: category.category_id,
      ...data,
      categoryLogoUrl: category.category_logo_url,
    };
    if (file?.file instanceof File) {
      const formData = new FormData();
      formData.append("image", file.file);
      const res = await uploadImageToIMG_BB(formData);
      const imageUrl = res?.data.url;
      payload = { ...payload, categoryLogoUrl: imageUrl };
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
            label="Category Name"
            placeholder="Enter category name"
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
            label="Category Description"
            placeholder="Enter category description"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <div className="rounded-xl border-2 p-1">
        <label className="mb-1 ml-2 inline-block text-xs">Category Logo</label>
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
