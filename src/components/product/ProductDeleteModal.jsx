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
import { TrashIcon } from "lucide-react";
import { PRODUCT_KEY } from "../../constants/query-key";
import { deleteProduct } from "../../service/product.service";

export function ProductDeleteModal({ id }) {
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

  const handleDelete = async () => {
    await mutateAsync(id);
  };

  return (
    <>
      <Button color="danger" size="sm" isIconOnly onPress={onOpen}>
        <TrashIcon className="size-4" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete this product?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. Please confirm if you want to proceed with the
                  deletion.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  onPress={handleDelete}
                  isLoading={isPending}
                  isDisabled={isPending}
                  color="danger">
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
