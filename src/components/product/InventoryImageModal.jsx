import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaImage } from "react-icons/fa6";
import Swal from "sweetalert2";
import { PRODUCT_INVENTORY_IMAGES_KEY } from "../../constants/query-key";
import { uploadImageToIMG_BB } from "../../service/image.service";
import {
  addProductInventoryImage,
  deleteProductInventoryImage,
  getProductInventoryImages,
  setProductInventoryDisplayImage,
} from "../../service/product.service";
import { InventoryFileUploadGallery } from "../ui/InventoryFileUploadGallery";

export function InventoryImageModal({ inventoryId }) {
  const [files, setFiles] = useState([]);

  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addProductInventoryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_IMAGES_KEY, inventoryId] });
      onClose();
      addToast({
        title: "Success",
        description: "Product image updated successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to update product image",
        color: "danger",
      });
    },
  });

  const { data } = useSuspenseQuery({
    queryKey: [PRODUCT_INVENTORY_IMAGES_KEY, inventoryId],
    queryFn: () => getProductInventoryImages(inventoryId),
  });
  const images = data?.images || [];

  const initialFiles = images.map((item) => ({
    id: item.product_image_id,
    url: item.image_url,
    isDisplayImage: item.is_display_image,
  }));

  const handleChangeDisplayImage = async (imageId) => {
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "Do you want to set this image as the display image?",
      icon: "question",
      confirmButtonText: "OK",
    });
    if (isConfirmed) {
      await setProductInventoryDisplayImage(imageId);
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_IMAGES_KEY, inventoryId] });
    }
  };

  const handleFileDelete = async (imageId) => {
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "question",
      confirmButtonText: "Delete",
    });
    if (isConfirmed) {
      await deleteProductInventoryImage(imageId);
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_IMAGES_KEY, inventoryId] });
    }
  };

  const handleUploadSubmit = async () => {
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
    if (images.length > 0) {
      const payload = {
        product_inventory_id: inventoryId,
        images,
      };
      await mutateAsync(payload);
    }
  };

  return (
    <>
      <Tooltip color="foreground" size="sm" content="Show images" className="rounded-md">
        <Button isIconOnly size="sm" onPress={onOpen}>
          <FaImage className="size-4" />
        </Button>
      </Tooltip>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center">Product Images</ModalHeader>
          <ModalBody>
            <InventoryFileUploadGallery
              initialFiles={initialFiles}
              onChangeDisplayImage={handleChangeDisplayImage}
              onFileDelete={handleFileDelete}
              onFileChange={setFiles}
            />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={isPending} isDisabled={isPending} onPress={handleUploadSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
