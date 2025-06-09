import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeIcon } from "lucide-react";
import { PRODUCT_KEY } from "../../constants/query-key";
import { deleteProduct } from "../../service/product.service";
import { FileUploadGallery } from "../ui/FileUploadGallery";

export function InventoryImageModal({ initialFiles }) {
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

  initialFiles = initialFiles.map((item) => ({
    id: item.product_image_id,
    url: item.image_url,
    isDisplayImage: item.is_display_image,
  }));

  return (
    <>
      <Button isIconOnly size="sm" onPress={onOpen}>
        <EyeIcon className="size-4" />
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center">Product Images</ModalHeader>
          <ModalBody>
            <FileUploadGallery initialFiles={initialFiles} />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={isPending} isDisabled={isPending}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
